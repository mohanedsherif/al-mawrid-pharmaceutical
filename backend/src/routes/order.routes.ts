import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../models/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppErrorClass } from '../middleware/errorHandler';

const router = express.Router();

// Create order (authenticated users only)
router.post(
  '/',
  authenticate,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isInt({ min: 1 }),
    body('items.*.quantity').isInt({ min: 1 }),
  ],
  async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
      }

      if (!req.user) {
        return next(new AppErrorClass('Authentication required', 401));
      }

      const { items, shippingAddress, shippingCity, shippingState, shippingZipCode, shippingCountry } = req.body;

      // Validate products exist and have stock
      for (const item of items) {
        const product = db.findProductById(item.productId);
        if (!product) {
          return next(new AppErrorClass(`Product ${item.productId} not found`, 404));
        }
        if (product.stockQuantity < item.quantity) {
          return next(new AppErrorClass(`Insufficient stock for product ${product.name}`, 400));
        }
      }

      const order = db.createOrder(req.user.userId, {
        items,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZipCode,
        shippingCountry,
      });

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Get user's orders
router.get('/my-orders', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(new AppErrorClass('Authentication required', 401));
    }

    const orders = db.findOrdersByUserId(req.user.userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get order by ID (own orders only, unless admin)
router.get('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(new AppErrorClass('Authentication required', 401));
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid order ID', 400));
    }

    const order = db.findOrderById(id);
    if (!order) {
      return next(new AppErrorClass('Order not found', 404));
    }

    // Users can only view their own orders, admins can view any
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
      return next(new AppErrorClass('Unauthorized', 403));
    }

    // Add user info for admin view
    if (req.user.role === 'ADMIN') {
      const user = db.findUserById(order.userId);
      if (user) {
        (order as any).userEmail = user.email;
        (order as any).userName = user.fullName;
      }
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;

