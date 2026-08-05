import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import Task from '../models/Task.js';
import { getPagination, paged } from '../utils/query.js';
import { emitChange } from '../utils/realtime.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const [items, total] = await Promise.all([
      Task.find(filter).populate('assignedTo', 'firstName lastName employeeId').populate('assignedBy', 'firstName lastName').sort('-createdAt').skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);
    res.json(paged(items, total, page, limit));
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { title, assignedTo, dueDate } = req.body;
    if (!title || !assignedTo || !dueDate) return res.status(400).json({ message: 'Title, assignee and due date are required' });
    const task = await Task.create({ ...req.body, assignedBy: req.user._id });
    emitChange('task:changed', { action: 'created', id: task._id, employee: task.assignedTo });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, assignedTo: req.user._id };
    const task = await Task.findOneAndUpdate(filter, { status: req.body.status }, { runValidators: true, returnDocument: 'after' });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    emitChange('task:changed', { action: 'updated', id: task._id, employee: task.assignedTo });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    emitChange('task:changed', { action: 'deleted', id: req.params.id, employee: task.assignedTo });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
