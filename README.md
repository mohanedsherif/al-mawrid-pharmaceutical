# AL-MAWRID Pharmaceuticals - Full Stack E-Commerce Platform

A modern pharmaceutical e-commerce platform built with React, Node.js, and Firebase.

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for routing
- **Firebase** (Hosting, Auth, Firestore, Analytics)

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation

## 📁 Project Structure

```
.
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── functions/         # Firebase Cloud Functions (optional)
├── firebase.json      # Firebase configuration
└── .firebaserc       # Firebase project settings
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase account and project

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

#### Backend (`backend/.env`)
```env
PORT=8081
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8081/api
```

## 🚢 Deployment

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Select the `backend` folder as the root
3. Set environment variables in Railway dashboard
4. Railway will auto-deploy on push

### Environment Variables for Railway

- `PORT` - Railway sets this automatically
- `JWT_SECRET` - Your JWT secret key
- `JWT_REFRESH_SECRET` - Your refresh token secret
- `FRONTEND_URL` - Your frontend URL (e.g., `https://al-mawrid-1.web.app`)
- `NODE_ENV` - `production`

## 📝 Default Admin Credentials

- **Email:** `admin@almawrid.com`
- **Password:** `admin123`

**⚠️ Change these in production!**

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - Get all categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Admin
- Dashboard stats, product/category/user/order management

## 🛠️ Development

### Running Locally

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Backend runs on: http://localhost:8081
4. Frontend runs on: http://localhost:5173

## 📦 Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm run build
```

## 🌐 Production URLs

- **Frontend:** https://al-mawrid-1.web.app
- **Backend API:** https://al-mawrid-backend.railway.app/api

## 📄 License

ISC

## 👨‍💻 Author

AL-MAWRID Pharmaceuticals

