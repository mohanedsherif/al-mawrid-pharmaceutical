# CORS Configuration Fix

## Problem
The backend CORS was only allowing `https://railway.com` instead of your Firebase hosting URL `https://al-mawrid-1.web.app`.

## Solution
I've updated the backend code to allow multiple origins including:
- `http://localhost:5173` (local development)
- `http://localhost:3000` (alternative local port)
- `https://al-mawrid-1.web.app` (Firebase hosting)
- `https://al-mawrid-1.firebaseapp.com` (Firebase hosting alternative)
- The `FRONTEND_URL` environment variable value

## Steps to Deploy the Fix

### Option 1: Update Railway Environment Variables (Recommended)
1. Go to your Railway dashboard: https://railway.app
2. Select your backend project (`al-mawrid-backend`)
3. Go to **Variables** tab
4. Add or update:
   ```
   FRONTEND_URL=https://al-mawrid-1.web.app
   NODE_ENV=production
   ```
5. Redeploy your backend service

### Option 2: Redeploy with Updated Code
1. The backend code has been updated to automatically allow the Firebase URLs
2. Push your changes to your repository
3. Railway will automatically redeploy
4. Make sure your Railway environment variables are set correctly

## Frontend Configuration
Make sure your frontend has the correct API URL. Create a `.env.production` file in the `frontend` directory:

```env
VITE_API_URL=https://al-mawrid-backend.railway.app/api
```

Then rebuild and redeploy:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## Testing
After deploying:
1. Visit: https://al-mawrid-1.web.app
2. Try to load products or login
3. Check browser console for any CORS errors
4. Should work without CORS issues now!

## Current Allowed Origins
The backend now allows:
- ✅ `https://al-mawrid-1.web.app`
- ✅ `https://al-mawrid-1.firebaseapp.com`
- ✅ `http://localhost:5173` (for local development)
- ✅ Any origin from `FRONTEND_URL` environment variable

