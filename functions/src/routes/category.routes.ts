import express from 'express';
import { db } from '../models/database';
import { AppErrorClass } from '../middleware/errorHandler';

const router = express.Router();

// Get all categories
router.get('/', (_req, res, next) => {
  try {
    const categories = db.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Get category by ID
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new AppErrorClass('Invalid category ID', 400));
    }

    const category = db.findCategoryById(id);
    if (!category) {
      return next(new AppErrorClass('Category not found', 404));
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

export default router;

