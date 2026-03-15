import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'TITLE_REQUIRED'),
  description: z.string().optional().nullable(),
  deadline: z.string().optional().nullable().refine((val) => {
    if (!val) return true;
    return !isNaN(Date.parse(val));
  }, { message: 'INVALID_DATE' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
