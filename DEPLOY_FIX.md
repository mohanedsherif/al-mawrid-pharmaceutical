# Fix CORS Errors - Deployment Guide

## Current Issue
Your backend on Railway is configured to only allow `https://railway.com`, but your frontend is at `https://al-mawrid-1.web.app`.

## Solution - Two Options

### Option 1: Quick Fix via Railway Environment Variables (Fastest)

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app
   - Select your backend service: `al-mawrid-backend`

2. **Add Environment Variable:**
   - Go to **Variables** tab
   - Add new variable:
     ```
     Key: FRONTEND_URL
     Value: https://al-mawrid-1.web.app
     ```
   - Click **Add** or **Update**

3. **Restart Service:**
   - Go to **Settings** tab
   - Click **Restart** or **Redeploy**

However, this alone might not fix it if the backend code doesn't handle multiple origins properly. The code update I made should help.

### Option 2: Deploy Updated Backend Code (Recommended)

The backend code has been updated to allow multiple origins. You need to:

1. **Commit and Push Changes:**
   ```bash
   git add backend/src/server.ts
   git commit -m "Fix CORS to allow Firebase hosting URL"
   git push
   ```
   
2. **Railway will auto-deploy** the changes (if connected to your repo)

3. **Or manually deploy:**
   - In Railway, trigger a redeploy
   - Make sure `FRONTEND_URL` environment variable is set to `https://al-mawrid-1.web.app`

### Option 3: Update Frontend to Use Correct API URL

Make sure your frontend is using the correct backend URL:

1. **Check if .env.production exists in frontend folder**
   - If not, create it:
     ```env
     VITE_API_URL=https://al-mawrid-backend.railway.app/api
     ```

2. **Rebuild and Redeploy Frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

## Verify the Fix

After deploying:

1. **Visit:** https://al-mawrid-1.web.app/login
2. **Open Browser Console** (F12)
3. **Try to login or load products**
4. **Check console** - CORS errors should be gone
5. **If still errors**, check Railway logs to see what origin it's receiving

## If Still Not Working

If you're still getting CORS errors after deploying:

1. **Check Railway Logs:**
   - Go to Railway → Your Service → Logs
   - Look for what `FRONTEND_URL` value is being used
   - Check for any CORS-related error messages

2. **Temporary Test - Allow All Origins (Development Only):**
   You can temporarily test by updating the backend to allow all origins:
   
   ```typescript
   app.use(cors({
     origin: true, // Allow all origins (NOT for production!)
     credentials: true,
     // ... rest of config
   }));
   ```
   
   **⚠️ WARNING:** Only use this for testing! Update to specific origins before production.

3. **Verify Backend is Running:**
   - Visit: https://al-mawrid-backend.railway.app/health
   - Should return: `{"status":"ok",...}`

## Expected Result

After fixing:
- ✅ No CORS errors in console
- ✅ Products load successfully
- ✅ Login works
- ✅ All API calls succeed

