# Set Environment Variables in Railway - CRITICAL!

## The Problem
The CORS error shows Railway backend is allowing `https://railway.com` instead of `https://al-mawrid-1.web.app`.

## Solution: Set Environment Variables in Railway

### Step-by-Step:

1. **In Railway Dashboard:**
   - Click on your service: **al-mawrid-pharmaceutical**
   - Go to **"Variables"** tab (you're already there!)

2. **Click "+ New Variable"** and add these one by one:

   **Variable 1:**
   - Key: `FRONTEND_URL`
   - Value: `https://al-mawrid-1.web.app`
   - Click **Add**

   **Variable 2:**
   - Key: `JWT_SECRET`
   - Value: `your-super-secret-jwt-key-change-in-production-12345`
   - Click **Add**

   **Variable 3:**
   - Key: `JWT_REFRESH_SECRET`
   - Value: `your-super-secret-refresh-token-key-67890`
   - Click **Add**

   **Variable 4:**
   - Key: `NODE_ENV`
   - Value: `production`
   - Click **Add**

3. **Restart/Redeploy:**
   - After adding variables, Railway will auto-redeploy
   - OR go to **Deployments** tab and click **"Redeploy"**

## Why This Fixes CORS

The backend code checks `FRONTEND_URL` environment variable and includes it in allowed origins. When you set it to `https://al-mawrid-1.web.app`, the backend will allow requests from that origin.

## Verify It Worked

After setting variables and redeploying:
1. Visit: https://al-mawrid-1.web.app
2. Try to login
3. Check console - CORS errors should be gone! ✅

The backend code already has the correct CORS configuration - it just needs the `FRONTEND_URL` variable set in Railway!

