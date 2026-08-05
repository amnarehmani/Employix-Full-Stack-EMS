import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import LeaveRequest from '../models/LeaveRequest.js';
import { getPagination, paged } from '../utils/query.js';
import { emitChange } from '../utils/realtime.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = req.user.role === 'admin' ? {} : { employee: req.user._id };
    const [items, total] = await Promise.all([
      LeaveRequest.find(filter).populate('employee', 'firstName lastName employeeId').populate('reviewedBy', 'firstName lastName').sort('-createdAt').skip(skip).limit(limit),
      LeaveRequest.countDocuments(filter),
    ]);
    res.json(paged(items, total, page, limit));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    if (!type || !startDate || !endDate || !reason) return res.status(400).json({ message: 'Type, dates and reason are required' });
    const leave = await LeaveRequest.create({ type, startDate, endDate, reason, employee: req.user._id });
    emitChange('leave:changed', { action: 'created', id: leave._id, employee: req.user._id });
    res.status(201).json(leave);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/review', authorize('admin'), async (req, res, next) => {
  try {
    const { status, reviewNote = '' } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Status must be approved or rejected' });
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status, reviewNote, reviewedBy: req.user._id }, { runValidators: true, returnDocument: 'after' });
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    emitChange('leave:changed', { action: status, id: leave._id, employee: leave.employee });
    res.json(leave);
  } catch (error) {
    next(error);
  }
});

export default router;
