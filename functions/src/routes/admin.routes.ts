import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../models/database';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { AppErrorClass } from '../middleware/errorHandler';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard Stats
router.get('/dashboard/stats', (_req, res, next) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/revenue/monthly', (_req, res, next) => {
  try {
    const revenue = db.getMonthlyRevenue();
    res.json(revenue);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/products/top', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topProducts = db.getTopProducts(limit);
    res.json(topProducts);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/orders/status', (_req, res, next) => {
  try {
    const statusCounts = db.getOrderStatusCounts();
    res.json(statusCounts);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/products/low-stock', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 50;
    const lowStock = db.getLowStockProducts(threshold);
    res.json(lowStock);
  } catch (error) {
    next(error);
  }
});

// Product Management
router.get('/products', (_req, res, next) => {
  try {
    const products = db.getAllProducts();
    const productsWithCategory = products.map(product => {
      const category = product.categoryId
        ? db.findCategoryById(product.categoryId)
        : null;
      return {
        ...product,
        categoryName: category?.name,
      };
    });
    res.json(productsWithCategory);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/products',
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stockQuantity').isInt({ min: 0 }),
  ],
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
      }

      const product = db.createProduct(req.body);
      const category = product.categoryId
        ? db.findCategoryById(product.categoryId)
        : null;

      return res.status(201).json({
        ...product,
        categoryName: category?.name,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.put('/products/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid product ID', 400));
    }

    const product = db.updateProduct(id, req.body);
    if (!product) {
      return next(new AppErrorClass('Product not found', 404));
    }

    const category = product.categoryId
      ? db.findCategoryById(product.categoryId)
      : null;

    res.json({
      ...product,
      categoryName: category?.name,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid product ID', 400));
    }

    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return next(new AppErrorClass('Product not found', 404));
    }

    res.json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Category Management
router.get('/categories', (_req, res, next) => {
  try {
    const categories = db.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/categories',
  [
    body('name').trim().notEmpty(),
  ],
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
      }

      const category = db.createCategory(req.body);
      return res.status(201).json(category);
    } catch (error) {
      return next(error);
    }
  }
);

router.put('/categories/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid category ID', 400));
    }

    const category = db.updateCategory(id, req.body);
    if (!category) {
      return next(new AppErrorClass('Category not found', 404));
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete('/categories/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid category ID', 400));
    }

    const deleted = db.deleteCategory(id);
    if (!deleted) {
      return next(new AppErrorClass('Category not found', 404));
    }

    res.json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Order Management
router.get('/orders', (_req, res, next) => {
  try {
    const orders = db.getAllOrders();
    const ordersWithUserInfo = orders.map(order => {
      const user = db.findUserById(order.userId);
      return {
        ...order,
        userEmail: user?.email,
        userName: user?.fullName,
      };
    });
    res.json(ordersWithUserInfo);
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid order ID', 400));
    }

    const order = db.findOrderById(id);
    if (!order) {
      return next(new AppErrorClass('Order not found', 404));
    }

    const user = db.findUserById(order.userId);
    res.json({
      ...order,
      userEmail: user?.email,
      userName: user?.fullName,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/orders/:id/status', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid order ID', 400));
    }

    const { status } = req.body;
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return next(new AppErrorClass('Invalid status', 400));
    }

    const order = db.updateOrder(id, { status });
    if (!order) {
      return next(new AppErrorClass('Order not found', 404));
    }

    const user = db.findUserById(order.userId);
    res.json({
      ...order,
      userEmail: user?.email,
      userName: user?.fullName,
    });
  } catch (error) {
    next(error);
  }
});

// User Management
router.get('/users', (_req, res, next) => {
  try {
    const users = db.getAllUsers();
    res.json(users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      enabled: user.enabled,
      createdAt: user.createdAt.toISOString(),
    })));
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid user ID', 400));
    }

    const user = db.findUserById(id);
    if (!user) {
      return next(new AppErrorClass('User not found', 404));
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      enabled: user.enabled,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/enable', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid user ID', 400));
    }

    const { enabled } = req.body;
    const user = db.updateUser(id, { enabled });
    if (!user) {
      return next(new AppErrorClass('User not found', 404));
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      enabled: user.enabled,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/feedbacks/pending/count', (_req, res, next) => {
  try {
    // Placeholder - in real app, this would query feedbacks table
    res.json(0);
  } catch (error) {
    next(error);
  }
});

export default router;

