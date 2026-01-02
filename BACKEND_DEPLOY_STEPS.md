# Backend Deployment Steps - Fix CORS

## Current Status
✅ Frontend deployed successfully to Firebase  
❌ Backend CORS still blocking requests (needs deployment)

## Quick Fix Options

### Option 1: Deploy via Git (Recommended if Railway is connected to your repo)

1. **Check git status:**
   ```bash
   git status
   ```

2. **Add and commit the backend changes:**
   ```bash
   git add backend/src/server.ts
   git commit -m "Fix CORS: Allow Firebase hosting URLs"
   git push
   ```

3. **Railway will auto-deploy** (if connected to GitHub/GitLab)

### Option 2: Manual Railway Update

If Railway isn't connected to your repo, you need to:

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app
   - Select your backend service

2. **Option A: Update via Railway CLI (if installed)**
   ```bash
   railway login
   railway link  # Link to your project
   cd backend
   railway up  # Deploy current directory
   ```

3. **Option B: Upload files manually or use Railway's web editor**
   - Go to your service → Settings → Source
   - Use Railway's file editor to update `backend/src/server.ts`
   - Or connect your GitHub repo if not already connected

### Option 3: Set Environment Variable in Railway (Quick Test)

Even if code isn't deployed yet, you can test by setting environment variable:

1. **Go to Railway Dashboard:**
   - Select your backend service
   - Go to **Variables** tab
   - Add/Update:
     ```
     FRONTEND_URL=https://al-mawrid-1.web.app
     NODE_ENV=production
     ```

2. **Restart the service**

However, this might not fully work if the code doesn't check this variable properly. The code update is still needed.

## Verify the Fix

After deploying:

1. **Test the backend directly:**
   ```
   https://al-mawrid-backend.railway.app/health
   ```
   Should return: `{"status":"ok",...}`

2. **Test from frontend:**
   - Visit: https://al-mawrid-1.web.app
   - Open browser console (F12)
   - Try to load products or login
   - **Should see NO CORS errors**

3. **Check Railway logs:**
   - In Railway dashboard → Logs
   - Should see: `🔗 Frontend URL: https://al-mawrid-1.web.app`

## Current CORS Configuration

The updated backend allows these origins:
- ✅ `https://al-mawrid-1.web.app` (Firebase hosting)
- ✅ `https://al-mawrid-1.firebaseapp.com` (Firebase alternative)
- ✅ `http://localhost:5173` (local dev)
- ✅ Any URL from `FRONTEND_URL` env variable

## Need Help?

If you're stuck:
1. Check if Railway is connected to your Git repo
2. Verify the backend service is running
3. Check Railway logs for errors
4. Make sure `FRONTEND_URL` environment variable is set

