import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.js';
import { mockAuth } from './middleware/auth.js';
import taskRoutes from './routes/taskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(mockAuth);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.get('/health', (req: Request, res: Response) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use(errorHandler);
export default app;
