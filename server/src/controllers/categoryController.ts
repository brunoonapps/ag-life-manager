import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, userId } = req.body;
    const category = await prisma.category.create({ data: { name, userId } });
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};
