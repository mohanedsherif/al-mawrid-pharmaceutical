import express from 'express';
import { query } from 'express-validator';
import { db } from '../models/database';
import { AppErrorClass } from '../middleware/errorHandler';

const router = express.Router();

// Get all products
router.get(
  '/',
  [
    query('categoryId').optional().isInt({ min: 1 }),
    query('search').optional().trim(),
  ],
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let products = db.getAllProducts();
      const { categoryId, search } = req.query;

      // Filter by category
      if (categoryId) {
        products = products.filter(p => p.categoryId === Number(categoryId));
      }

      // Search filter
      if (search) {
        const searchLower = String(search).toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }

      // Add category name
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
  }
);

// Get product by ID
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid product ID', 400));
    }

    const product = db.findProductById(id);
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

export default router;

