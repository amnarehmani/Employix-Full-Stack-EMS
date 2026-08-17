import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errorHandler, notFound } from '../server/middleware/error.js';
import { setRealtimeServer } from '../server/utils/realtime.js';

dotenv.config();

let dbConnected = false;
let routesReady = false;

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: clientUrl }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) => {
  if (!routesReady) return res.json({ status: 'starting', database: 'connecting', routes: 'loading' });
  res.json({ status: dbConnected ? 'ok' : 'degraded', database: dbConnected ? 'connected' : 'disconnected', routes: 'ready' });
});

const requireDb = (req, res, next) => {
  if (!dbConnected) return res.status(503).json({ message: 'Database is still connecting. Please retry in a few moments.' });
  next();
};

app.use('/api', requireDb);

Promise.all([
  import('../server/config/db.js'),
  import('../server/routes/auth.js'),
  import('../server/routes/dashboard.js'),
  import('../server/routes/employees.js'),
  import('../server/routes/departments.js'),
  import('../server/routes/attendance.js'),
  import('../server/routes/leaves.js'),
  import('../server/routes/payslips.js'),
  import('../server/routes/tasks.js'),
  import('../server/routes/profile.js'),
]).then(([db, auth, dashboard, employees, departments, attendance, leaves, payslips, tasks, profile]) => {
  app.use('/api/auth', auth.default);
  app.use('/api/dashboard', dashboard.default);
  app.use('/api/employees', employees.default);
  app.use('/api/departments', departments.default);
  app.use('/api/attendance', attendance.default);
  app.use('/api/leaves', leaves.default);
  app.use('/api/payslips', payslips.default);
  app.use('/api/tasks', tasks.default);
  app.use('/api/profile', profile.default);

  app.use(notFound);
  app.use(errorHandler);

  routesReady = true;

  db.connectDB().then(() => {
    const interval = setInterval(() => {
      if (db.dbConnected) {
        dbConnected = true;
        clearInterval(interval);
      }
    }, 500);
  });
}).catch((err) => {
  console.error('Failed to load modules:', err.message);
});

export default app;
