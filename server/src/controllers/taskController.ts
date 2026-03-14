import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await prisma.task.findMany({ include: { category: true, tags: true } });
    res.json({ success: true, data: tasks });
  } catch (error) { next(error); }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, deadline, priority, categoryId, userId } = req.body;
    const task = await prisma.task.create({
      data: { title, description, deadline: deadline ? new Date(deadline) : null, priority, userId, categoryId }
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const [total, completedToday, overdue] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'DONE', updatedAt: { gte: todayStart } } }),
      prisma.task.count({ where: { status: 'TODO', deadline: { lt: now } } })
    ]);
    res.json({ success: true, data: { total, completedToday, overdue } });
  } catch (error) { next(error); }
};
