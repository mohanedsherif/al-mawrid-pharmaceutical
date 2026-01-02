import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppErrorClass } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppErrorClass('No token provided', 401);
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      email: string;
      role: 'USER' | 'ADMIN';
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppErrorClass('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppErrorClass('Token expired', 401));
    }
    next(error);
  }
};

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppErrorClass('Authentication required', 401));
  }

  if (req.user.role !== 'ADMIN') {
    return next(new AppErrorClass('Admin access required', 403));
  }

  next();
};

