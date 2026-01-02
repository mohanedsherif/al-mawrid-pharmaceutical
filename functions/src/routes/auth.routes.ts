import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppErrorClass } from '../middleware/errorHandler';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-token-key-change-this-too';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate tokens
const generateTokens = (userId: number, email: string, role: 'USER' | 'ADMIN') => {
  const accessToken = jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').trim().notEmpty(),
  ],
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
      }

      const { email, password, fullName } = req.body;

      // Check if user exists
      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        return next(new AppErrorClass('User with this email already exists', 400));
      }

      // Create user
      const user = await db.createUser({ email, password, fullName, role: 'USER' });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = db.findUserByEmail(email);
      if (!user || !user.enabled) {
        return next(new AppErrorClass('Invalid email or password', 401));
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return next(new AppErrorClass('Invalid email or password', 401));
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

      res.json({
        status: 'success',
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppErrorClass('Refresh token required', 400));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: number;
      email: string;
      role: 'USER' | 'ADMIN';
    };

    // Check if user still exists and is enabled
    const user = db.findUserById(decoded.userId);
    if (!user || !user.enabled) {
      return next(new AppErrorClass('User not found or disabled', 401));
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.email, user.role);

    res.json({
      status: 'success',
      ...tokens,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppErrorClass('Invalid refresh token', 401));
    }
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(new AppErrorClass('User not found', 404));
    }

    const user = db.findUserById(req.user.userId);
    if (!user) {
      return next(new AppErrorClass('User not found', 404));
    }

    res.json({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      enabled: user.enabled,
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authenticate, (_req, res) => {
  // In a real app, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

export default router;

