import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchema.js';

export const getTasks = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const tasks = await prisma.task.findMany({ 
      where: { userId },
      include: { category: true, tags: true } 
    });
    res.json({ success: true, data: tasks });
  } catch (error) { next(error); }
};

export const createTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const validatedData = createTaskSchema.parse(req.body);
    const { title, description, deadline, priority, categoryId, tags } = validatedData;
    
    if (deadline && new Date(deadline) < new Date(new Date().setHours(0,0,0,0))) {
      return res.status(400).json({ success: false, message: 'DEADLINE_CANNOT_BE_IN_PAST' });
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: deadline && !isNaN(Date.parse(deadline)) ? new Date(deadline) : null,
        priority: priority || 'MEDIUM',
        userId,
        categoryId: categoryId || null,
        tags: {
          connectOrCreate: (tags || []).map((tagName: string) => ({
            where: { name_userId: { name: tagName, userId } },
            create: { name: tagName, userId }
          }))
        }
      },
      include: { category: true, tags: true }
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const getStats = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const [total, completedToday, overdue] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'DONE', updatedAt: { gte: todayStart } } }),
      prisma.task.count({ where: { userId, status: 'TODO', deadline: { lt: now } } })
    ]);
    res.json({ success: true, data: { total, completedToday, overdue } });
  } catch (error) { next(error); }
};

export const deleteTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await prisma.task.delete({ where: { id: id as string, userId } });
    res.json({ success: true, message: 'TASK_TERMINATED' });
  } catch (error) { next(error); }
};

export const updateTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const validatedData = updateTaskSchema.parse(req.body);
    const { title, description, deadline, priority, categoryId, tags } = validatedData;

    const parsedDeadline = deadline && !isNaN(Date.parse(deadline)) ? new Date(deadline) : null;

    const task = await prisma.task.update({
      where: { id: id as string, userId },
      data: {
        title,
        description,
        deadline: parsedDeadline,
        priority,
        categoryId: categoryId === '' ? null : categoryId,
        tags: tags ? {
          set: [],
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name_userId: { name: tagName, userId } },
            create: { name: tagName, userId }
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

export const toggleTaskStatus = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const task = await prisma.task.findUnique({ where: { id: id as string, userId } });
    if (!task) return res.status(404).json({ success: false, message: 'TASK_NOT_FOUND' });

    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    const updatedTask = await prisma.task.update({
      where: { id: id as string, userId },
      data: { status: newStatus },
      include: { category: true, tags: true }
    });
    res.json({ success: true, data: updatedTask });
  } catch (error) { next(error); }
};
