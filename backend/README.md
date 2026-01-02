# AL-MAWRID Pharmaceuticals Backend API

Node.js/Express backend API for AL-MAWRID Pharmaceuticals e-commerce platform.

## Features

- 🔐 JWT-based authentication
- 📦 Product management
- 📂 Category management
- 🛒 Order processing
- 👥 User management
- 📊 Admin dashboard APIs
- 🔒 Role-based access control (Admin/User)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: In-memory (easily replaceable with MongoDB/PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=8080
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-too
FRONTEND_URL=http://localhost:5173
```

### Running the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)

### Admin APIs (Admin only)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/revenue/monthly` - Monthly revenue
- `GET /api/admin/dashboard/products/top` - Top selling products
- `GET /api/admin/dashboard/orders/status` - Order status counts
- `GET /api/admin/dashboard/products/low-stock` - Low stock products
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order by ID
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PATCH /api/admin/users/:id/enable` - Enable/disable user

## Default Admin Account

After starting the server, you can login with:
- **Email**: `admin@almawrid.com`
- **Password**: `admin123`

⚠️ **Change this password in production!**

## Database

Currently uses an in-memory database for simplicity. To use a real database:

1. Install database driver (e.g., `mongodb`, `pg`, `mongoose`)
2. Replace `src/models/database.ts` with database queries
3. Update connection string in `.env`

## CORS Configuration

The backend is configured to accept requests from the frontend URL specified in `.env`. Update `FRONTEND_URL` if your frontend runs on a different port/domain.

## Error Handling

All errors follow a consistent format:
```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Development

- Run type checking: `npm run type-check`
- Run linter: `npm run lint`
- Build: `npm run build`

## License

ISC

