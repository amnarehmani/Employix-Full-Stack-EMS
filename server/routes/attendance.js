import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';
import { getPagination, paged } from '../utils/query.js';
import { emitChange } from '../utils/realtime.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = req.user.role === 'admin' ? {} : { employee: req.user._id };
    const [items, total] = await Promise.all([
      Attendance.find(filter).populate('employee', 'firstName lastName employeeId').sort('-date').skip(skip).limit(limit),
      Attendance.countDocuments(filter),
    ]);
    res.json(paged(items, total, page, limit));
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { employee, date, status } = req.body;
    if (!employee || !date || !status) return res.status(400).json({ message: 'Employee, date and status are required' });
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const record = await Attendance.findOneAndUpdate({ employee, date: day }, { ...req.body, date: day }, { returnDocument: 'after', upsert: true, runValidators: true }).populate('employee', 'firstName lastName employeeId');
    emitChange('attendance:changed', { action: 'upserted', id: record._id, employee });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

export default router;
