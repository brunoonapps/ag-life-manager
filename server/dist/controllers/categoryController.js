import { prisma } from '../config/prisma.js';
export const getCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const categories = await prisma.category.findMany({ where: { userId } });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
};
export const createCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const category = await prisma.category.create({ data: { name, userId } });
        res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        next(error);
    }
};
