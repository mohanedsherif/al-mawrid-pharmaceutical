# Environment Variables Setup

## Problem
When deploying to Firebase, the app tries to connect to `http://localhost:8080/api` which doesn't work in production.

## Solution

You need to set the `VITE_API_URL` environment variable to point to your production backend API.

### Step 1: Deploy Your Backend

First, make sure your backend is deployed somewhere accessible. Options:
- **Heroku**: `https://your-app.herokuapp.com`
- **Railway**: `https://your-app.railway.app`
- **AWS/Google Cloud/Azure**: Your deployed backend URL
- **Custom Domain**: `https://api.yourdomain.com`

### Step 2: Create Environment Files

Create these files in the `frontend` directory:

#### `frontend/.env` (for local development)
```
VITE_API_URL=http://localhost:8080/api
```

#### `frontend/.env.production` (for production builds)
```
VITE_API_URL=https://your-actual-backend-url.com/api
```

**Important**: Replace `https://your-actual-backend-url.com/api` with your actual backend URL.

### Step 3: Rebuild and Redeploy

After creating `.env.production`:

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

Or use the deploy script:
```bash
cd frontend
npm run deploy
```

### Step 4: Update Backend CORS

Make sure your backend CORS configuration allows your Firebase domain. The backend CORS config has been updated to include:
- `https://al-mawrid-1.web.app`
- `https://al-mawrid-1.firebaseapp.com`

If you deploy your backend, make sure it includes these origins in its CORS configuration.

## Quick Setup Commands

```bash
# Create .env for local development
echo "VITE_API_URL=http://localhost:8080/api" > frontend/.env

# Create .env.production (replace with your backend URL)
echo "VITE_API_URL=https://your-backend-url.com/api" > frontend/.env.production

# Rebuild and deploy
cd frontend
npm run deploy
```

## Verification

After deployment, check the browser console. You should see API requests going to your production backend URL, not `localhost:8080`.


