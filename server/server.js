import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { errorHandler, notFound } from './middleware/error.js';
import { setRealtimeServer } from './utils/realtime.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

let dbConnected = false;
let routesReady = false;

app.get('/api/health', (req, res) => {
  if (!routesReady) return res.json({ status: 'starting', database: 'connecting', routes: 'loading' });
  res.json({ status: dbConnected ? 'ok' : 'degraded', database: dbConnected ? 'connected' : 'disconnected', routes: 'ready' });
});

const requireDb = (req, res, next) => {
  if (!dbConnected) return res.status(503).json({ message: 'Database is still connecting. Please retry in a few moments.' });
  next();
};

app.use('/api', requireDb);

const setupRoutes = async () => {
  const [db, auth, dashboard, employees, departments, attendance, leaves, payslips, tasks, profile] = await Promise.all([
    import('./config/db.js'),
    import('./routes/auth.js'),
    import('./routes/dashboard.js'),
    import('./routes/employees.js'),
    import('./routes/departments.js'),
    import('./routes/attendance.js'),
    import('./routes/leaves.js'),
    import('./routes/payslips.js'),
    import('./routes/tasks.js'),
    import('./routes/profile.js'),
  ]);

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
  console.log('API routes registered');

  await db.connectDB();
  const interval = setInterval(() => {
    if (db.dbConnected) {
      dbConnected = true;
      clearInterval(interval);
      console.log('Database connection ready - API fully operational');
    }
  }, 500);
};

if (!process.env.VERCEL) {
  const server = createServer(app);
  const io = new Server(server, { cors: { origin: clientUrl } });
  setRealtimeServer(io);

  io.on('connection', (socket) => {
    socket.emit('connected', { message: 'Realtime connected' });
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Loading modules and connecting to MongoDB...');
    setupRoutes().catch((err) => {
      console.error('Failed to load modules:', err.message);
    });
  });
} else {
  setupRoutes().catch((err) => {
    console.error('Failed to load modules:', err.message);
  });
}

export default app;
