# Quick Start Guide

## 1. Create .env file

Create a file named `.env` in the backend folder with the following content:

```env
PORT=8081
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## 2. Start the backend server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:8081`

## 3. Test the API

- Health check: `http://localhost:8081/health`
- API base: `http://localhost:8081/api`

## Default Admin Account

- Email: `admin@almawrid.com`
- Password: `admin123`

⚠️ **Change this in production!**

