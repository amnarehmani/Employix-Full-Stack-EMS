import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import Payslip from '../models/Payslip.js';
import User from '../models/User.js';
import { emitChange } from '../utils/realtime.js';
import { getPagination, paged } from '../utils/query.js';

const router = express.Router();
router.use(protect);

const calculateNetPay = ({ basicSalary, allowances = 0, deductions = 0, tax = 0 }) => {
  const netPay = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0) - Number(tax || 0);
  return Math.max(netPay, 0);
};

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search = req.query.search || '';
    const employeeIds = search
      ? await User.find({
          role: 'employee',
          $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }, { employeeId: new RegExp(search, 'i') }],
        }).distinct('_id')
      : [];
    const filter = {
      ...(req.user.role === 'admin' ? {} : { employee: req.user._id }),
      ...(req.query.status ? { status: req.query.status } : {}),
      ...(search ? { employee: { $in: employeeIds } } : {}),
    };

    const [items, total] = await Promise.all([
      Payslip.find(filter).populate('employee', 'firstName lastName employeeId email designation department').populate('generatedBy', 'firstName lastName').sort('-year -month -createdAt').skip(skip).limit(limit),
      Payslip.countDocuments(filter),
    ]);

    res.json(paged(items, total, page, limit));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, employee: req.user._id };
    const payslip = await Payslip.findOne(filter).populate('employee', 'firstName lastName employeeId email designation department salary').populate('generatedBy', 'firstName lastName');
    if (!payslip) return res.status(404).json({ message: 'Payslip not found' });
    res.json(payslip);
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { employee, month, year, basicSalary, allowances = 0, deductions = 0, tax = 0, notes = '' } = req.body;
    if (!employee || !month || !year || basicSalary === undefined) {
      return res.status(400).json({ message: 'Employee, month, year and basic salary are required' });
    }

    const targetEmployee = await User.findOne({ _id: employee, role: 'employee' });
    if (!targetEmployee) return res.status(404).json({ message: 'Employee not found' });

    const payslip = await Payslip.create({
      employee,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      tax,
      netPay: calculateNetPay({ basicSalary, allowances, deductions, tax }),
      notes,
      generatedBy: req.user._id,
    });

    emitChange('payslip:changed', { action: 'created', id: payslip._id, employee });
    res.status(201).json(payslip);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Payslip already exists for this employee and month' });
    next(error);
  }
});

router.patch('/:id/pay', authorize('admin'), async (req, res, next) => {
  try {
    const payslip = await Payslip.findByIdAndUpdate(req.params.id, { status: 'paid', paidAt: new Date() }, { runValidators: true, returnDocument: 'after' });
    if (!payslip) return res.status(404).json({ message: 'Payslip not found' });
    emitChange('payslip:changed', { action: 'paid', id: payslip._id, employee: payslip.employee });
    res.json(payslip);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const payslip = await Payslip.findByIdAndDelete(req.params.id);
    if (!payslip) return res.status(404).json({ message: 'Payslip not found' });
    emitChange('payslip:changed', { action: 'deleted', id: req.params.id, employee: payslip.employee });
    res.json({ message: 'Payslip deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
