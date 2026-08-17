import dotenv from 'dotenv';

dotenv.config();

const app = (await import('../server.js')).default;

export default app;
