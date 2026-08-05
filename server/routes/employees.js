import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { getPagination, paged } from '../utils/query.js';
import { emitChange } from '../utils/realtime.js';

const router = express.Router();
router.use(protect);

router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search = req.query.search || '';
    const filter = {
      role: 'employee',
      ...(search && {
        $or: [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { employeeId: new RegExp(search, 'i') },
          { designation: new RegExp(search, 'i') },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      User.find(filter).select('-password').populate('department', 'name code').sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json(paged(items, total, page, limit));
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, employeeId } = req.body;
    if (!firstName || !lastName || !email || !password || !employeeId) {
      return res.status(400).json({ message: 'First name, last name, email, password and employee ID are required' });
    }

    const employee = await User.create({ ...req.body, role: 'employee' });
    emitChange('employee:changed', { action: 'created', id: employee._id });
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email or employee ID already exists' });
    next(error);
  }
});

router.put('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.role;
    const employee = await User.findOneAndUpdate({ _id: req.params.id, role: 'employee' }, updates, { runValidators: true, returnDocument: 'after' }).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    emitChange('employee:changed', { action: 'updated', id: employee._id });
    res.json(employee);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const employee = await User.findOneAndDelete({ _id: req.params.id, role: 'employee' });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    emitChange('employee:changed', { action: 'deleted', id: req.params.id });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
