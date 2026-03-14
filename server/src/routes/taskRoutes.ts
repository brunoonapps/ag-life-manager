import { Router } from 'express';
import { getTasks, createTask, getStats } from '../controllers/taskController.js';
const router = Router();
router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getStats);
export default router;
