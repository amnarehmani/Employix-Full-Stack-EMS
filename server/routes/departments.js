import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import Department from '../models/Department.js';
import { emitChange } from '../utils/realtime.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const filter = search ? { name: new RegExp(search, 'i') } : {};
    res.json(await Department.find(filter).populate('manager', 'firstName lastName').sort('name'));
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ message: 'Name and code are required' });
    const department = await Department.create(req.body);
    emitChange('department:changed', { action: 'created', id: department._id });
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Department name or code already exists' });
    next(error);
  }
});

router.put('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, returnDocument: 'after' });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    emitChange('department:changed', { action: 'updated', id: department._id });
    res.json(department);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    emitChange('department:changed', { action: 'deleted', id: req.params.id });
    res.json({ message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
