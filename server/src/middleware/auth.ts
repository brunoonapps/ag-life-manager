import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

import { auth } from '../config/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ success: false, message: 'UNAUTHORIZED' });
  }

  req.user = session.user;
  req.session = session.session;
  next();
};
