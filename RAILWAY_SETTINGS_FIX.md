# Railway Settings Configuration - IMPORTANT!

## The Problem
Railway is trying to build from the root directory instead of the `backend` directory, causing `npm: command not found` error.

## SOLUTION: Configure Root Directory in Railway

### Step-by-Step Instructions:

1. **In Railway Dashboard:**
   - Click on your service: **al-mawrid-pharmaceutical**
   - Click on **"Settings"** tab (top right)

2. **Set Root Directory:**
   - Scroll down to find **"Root Directory"** field
   - Enter exactly: `backend`
   - Click **"Save"** or **"Update"**

3. **Set Build Settings (if available):**
   - **Builder:** Select "Dockerfile" or "Nixpacks"
   - **Dockerfile Path:** Should auto-detect or set to `Dockerfile` (it's in backend folder)
   - **Build Command:** Leave empty (Dockerfile handles this)
   - **Start Command:** Leave empty (Dockerfile handles this)

4. **Redeploy:**
   - Go back to **"Deployments"** tab
   - Click **"Redeploy"** (or Railway will auto-redeploy after saving)

## After Setting Root Directory

Railway should now:
- ✅ Look for `package.json` in `backend/` folder
- ✅ Use the Dockerfile from `backend/Dockerfile`
- ✅ Install Node.js and npm properly
- ✅ Build and deploy successfully

## If Still Failing

1. **Check the logs:**
   - Click "View logs" on the failed deployment
   - Look for what directory it's building from

2. **Verify files are in backend/:**
   - `backend/package.json` ✅
   - `backend/Dockerfile` ✅
   - `backend/src/` ✅

3. **Alternative: Use Nixpacks without Dockerfile**
   - In Settings, try setting Builder to "Nixpacks"
   - Make sure Root Directory is still `backend`
   - Nixpacks should auto-detect Node.js from package.json

## Current Configuration Files

- ✅ `backend/Dockerfile` - Full Docker configuration
- ✅ `backend/nixpacks.toml` - Nixpacks configuration
- ✅ `backend/Procfile` - Process file
- ✅ `railway.json` - Railway configuration (points to backend/Dockerfile)

**The key is setting Root Directory to `backend` in Railway Settings!**

