import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const mockAuth = async (req: any, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
  if (user) {
    req.user = user;
    if (req.method === 'POST') req.body.userId = user.id;
  }
  next();
};
