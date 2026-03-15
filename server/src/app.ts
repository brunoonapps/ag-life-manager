import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { prisma } from './config/prisma.js';
import { errorHandler } from './middleware/error.js';
import { authMiddleware } from './middleware/auth.js';
import { auth } from './config/auth.js';
import { toNodeHandler } from 'better-auth/node';
import taskRoutes from './routes/taskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app: Express = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/auth/mock-login', async (req, res) => {
  try {
    const email = 'dev@analyticalgrid.com';
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: 'dev-user-id',
        email,
        name: 'Developer Admin',
      }
    });
    
    const token = 'mock-session-token-' + Math.random().toString(36).substring(2);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        id: 'mock-session-id-' + Math.random().toString(36).substring(2),
        token,
        userId: user.id,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    
    res.cookie('better-auth.session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Mock Login Error:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.use('/api/auth', toNodeHandler(auth));

app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.get('/health', (req: Request, res: Response) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use(errorHandler);
export default app;
