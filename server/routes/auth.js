import express from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret-change-me', { expiresIn: '7d' });

const sanitize = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

router.post('/signup', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role = 'employee' } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'First name, last name, email and password are required' });
    }

    const users = await User.countDocuments();
    const safeRole = users === 0 ? 'admin' : role === 'admin' ? 'employee' : role;
    const user = await User.create({ firstName, lastName, email, password, role: safeRole });
    res.status(201).json({ token: signToken(user), user: sanitize(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Email, password and role are required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.role !== role) return res.status(403).json({ message: `This account is not registered as ${role}` });
    if (user.status !== 'active') return res.status(403).json({ message: 'Account is inactive' });

    res.json({ token: signToken(user), user: sanitize(user) });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, (req, res) => res.json({ user: req.user }));

export default router;
