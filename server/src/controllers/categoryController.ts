import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getCategories = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    let categories = await prisma.category.findMany({ where: { userId } });
    
    // Seed default categories if none exist
    if (categories.length === 0) {
      const defaults = [
        { name: 'Trabalho', userId },
        { name: 'Estudos', userId },
        { name: 'Casa', userId }
      ];
      await prisma.category.createMany({ data: defaults });
      categories = await prisma.category.findMany({ where: { userId } });
    }
    
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
};

export const createCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name, userId } });
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};
