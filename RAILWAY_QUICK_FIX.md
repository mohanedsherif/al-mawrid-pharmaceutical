# Quick Fix: Update Railway CORS Configuration

## The Problem
Your Railway backend is configured to only allow `https://railway.com` instead of `https://al-mawrid-1.web.app`.

## The Solution (Takes 2 Minutes!)

### Option 1: Update Environment Variable in Railway (Easiest)

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Select your backend service: `al-mawrid-backend`

2. **Go to Variables Tab:**
   - Click on **Variables** in the left sidebar
   - Or go to your service → **Variables** tab

3. **Add/Update Environment Variable:**
   - Click **+ New Variable**
   - Key: `FRONTEND_URL`
   - Value: `https://al-mawrid-1.web.app`
   - Click **Add**

4. **Restart/Redeploy:**
   - Go to **Settings** tab
   - Click **Restart** or **Redeploy**

5. **Verify:**
   - Visit: https://al-mawrid-1.web.app
   - Try to login
   - Check console - CORS errors should be gone!

### Option 2: Deploy Updated Code to Railway

If you have Railway connected to GitHub/GitLab:

1. **Commit and Push:**
   ```bash
   git add backend/src/server.ts
   git commit -m "Fix CORS for Firebase hosting"
   git push
   ```

2. **Railway will auto-deploy** the changes

3. **Set Environment Variable:**
   - Still set `FRONTEND_URL=https://al-mawrid-1.web.app` in Railway Variables

## Why This Works

The backend code I updated checks the `FRONTEND_URL` environment variable and also includes `https://al-mawrid-1.web.app` in the allowed origins list. Setting the environment variable ensures it's definitely included.

## Test It

After updating:
1. Visit: https://al-mawrid-1.web.app/login
2. Open browser console (F12)
3. Try to login or load products
4. **No CORS errors!** ✅

## Alternative: Upgrade Firebase Plan

If you want to use Firebase Functions instead:
1. Go to: https://console.firebase.google.com/project/al-mawrid-1/usage/details
2. Upgrade to Blaze plan (free tier still applies, just requires credit card)
3. Then deploy: `firebase deploy --only functions`

But the Railway fix is **much faster and free**!

