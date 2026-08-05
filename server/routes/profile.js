import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
router.use(protect);

router.put('/', async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'address'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const user = await User.findByIdAndUpdate(req.user._id, updates, { runValidators: true, returnDocument: 'after' }).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
