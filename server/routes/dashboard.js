import express from 'express';
import { protect } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';
import Department from '../models/Department.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Payslip from '../models/Payslip.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();
router.use(protect);

router.get('/stats', async (req, res, next) => {
  try {
    const ownEmployee = req.user.role === 'admin' ? {} : { _id: req.user._id };
    const ownRecord = req.user.role === 'admin' ? {} : { employee: req.user._id };
    const ownTask = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

    const [employees, departments, pendingLeaves, openTasks, attendance, payroll] = await Promise.all([
      User.countDocuments({ role: 'employee', ...ownEmployee }),
      Department.countDocuments({ status: 'active' }),
      LeaveRequest.countDocuments({ ...ownRecord, status: 'pending' }),
      Task.countDocuments({ ...ownTask, status: { $ne: 'completed' } }),
      Attendance.countDocuments(ownRecord),
      Payslip.aggregate([
        { $match: req.user.role === 'admin' ? {} : { employee: req.user._id } },
        { $group: { _id: '$status', total: { $sum: '$netPay' }, count: { $sum: 1 } } },
      ]),
    ]);

    const payrollSummary = payroll.reduce((summary, item) => ({ ...summary, [item._id]: { total: item.total, count: item.count } }), {});
    res.json({ employees, departments, pendingLeaves, openTasks, attendance, payroll: payrollSummary });
  } catch (error) {
    next(error);
  }
});

export default router;
