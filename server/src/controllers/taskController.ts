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
    const { title, description, deadline, priority, categoryId, userId, tags } = req.body;
    
    if (deadline && new Date(deadline) < new Date(new Date().setHours(0,0,0,0))) {
      return res.status(400).json({ success: false, message: 'DEADLINE_CANNOT_BE_IN_PAST' });
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: deadline && !isNaN(Date.parse(deadline)) ? new Date(deadline) : null,
        priority: priority || 'MEDIUM',
        userId: userId || 'test-user-id',
        categoryId: categoryId || null,
        tags: {
          connectOrCreate: (tags || []).map((tagName: string) => ({
            where: { name_userId: { name: tagName, userId: userId || 'test-user-id' } },
            create: { name: tagName, userId: userId || 'test-user-id' }
          }))
        }
      },
      include: { category: true, tags: true }
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

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: id as string } });
    res.json({ success: true, message: 'TASK_TERMINATED' });
  } catch (error) { next(error); }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, priority, categoryId, userId, tags } = req.body;

    const parsedDeadline = deadline && !isNaN(Date.parse(deadline)) ? new Date(deadline) : null;
    const effectiveUserId = userId || 'test-user-id';

    const task = await prisma.task.update({
      where: { id: id as string },
      data: {
        title,
        description,
        deadline: parsedDeadline,
        priority,
        categoryId: categoryId === '' ? null : categoryId,
        tags: tags ? {
          set: [],
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name_userId: { name: tagName, userId: effectiveUserId } },
            create: { name: tagName, userId: effectiveUserId }
          }))
        } : undefined
      },
      include: { category: true, tags: true }
    });
    res.json({ success: true, data: task });
  } catch (error) { 
    console.error('[updateTask Error]:', error);
    next(error); 
  }
};

export const toggleTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: id as string } });
    if (!task) return res.status(404).json({ success: false, message: 'TASK_NOT_FOUND' });

    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    const updatedTask = await prisma.task.update({
      where: { id: id as string },
      data: { status: newStatus },
      include: { category: true, tags: true }
    });
    res.json({ success: true, data: updatedTask });
  } catch (error) { next(error); }
};
