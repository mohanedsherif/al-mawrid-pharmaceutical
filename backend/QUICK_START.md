# 🚀 Quick Start Guide - AL-MAWRID Backend

## ✅ Installation Complete!

The Node.js backend has been successfully created and all dependencies are installed.

## 🏃 Running the Server

1. **Make sure you're in the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8081`

3. **Verify it's running:**
   - Open browser: `http://localhost:8081/health`
   - You should see: `{"status":"ok","message":"AL-MAWRID Pharmaceuticals API is running",...}`

## 🔐 Default Admin Account

After the server starts, you can login with:

- **Email**: `admin@almawrid.com`
- **Password**: `admin123`

⚠️ **Important**: Change this password before deploying to production!

## 📡 API Endpoints

### Base URL: `http://localhost:8081/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout (requires auth)

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Categories (Public)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Orders (Authenticated Users)
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID

### Admin APIs (Admin Only)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/revenue/monthly` - Monthly revenue
- `GET /api/admin/dashboard/products/top` - Top selling products
- `GET /api/admin/dashboard/orders/status` - Order status counts
- `GET /api/admin/dashboard/products/low-stock` - Low stock alerts
- `GET /api/admin/products` - Get all products (admin view)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/enable` - Enable/disable user

## 🔧 Configuration

The `.env` file has been created with default values:
- `PORT=8081`
- `JWT_SECRET` - Change this in production!
- `FRONTEND_URL=http://localhost:5173`

## 📦 What's Included

✅ Express.js server with TypeScript  
✅ JWT authentication  
✅ Role-based access control (Admin/User)  
✅ Product management APIs  
✅ Category management APIs  
✅ Order processing  
✅ Admin dashboard APIs  
✅ In-memory database (ready for MongoDB/PostgreSQL migration)  
✅ CORS configured  
✅ Error handling middleware  
✅ Input validation  

## 🗄️ Database

Currently uses an in-memory database with sample data:
- 1 default admin user
- 6 product categories
- 3 sample products

**To use a real database:**
1. Install database driver (e.g., `mongodb`, `pg`)
2. Replace `src/models/database.ts` with database queries
3. Update connection string in `.env`

## 🎯 Next Steps

1. Start the backend: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Test the integration!

## 📚 Documentation

See `README.md` for full API documentation.

---

**Happy coding! 🎉**

