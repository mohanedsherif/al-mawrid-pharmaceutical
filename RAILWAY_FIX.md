# Fix Railway Build Error

## Problem
Railway failed with "Error creating build plan with Railpack" because it's trying to build from the root directory instead of the `backend` folder.

## Solution: Configure Root Directory

### Step 1: Go to Service Settings

1. In Railway dashboard, click on your service: **al-mawrid-pharmaceutical**
2. Click on the **"Settings"** tab (top right)

### Step 2: Set Root Directory

1. Scroll down to find **"Root Directory"** section
2. Enter: `backend`
3. Click **"Save"** or **"Update"**

### Step 3: Set Build and Start Commands

In the same Settings page:

1. **Build Command:**
   ```
   npm run build
   ```

2. **Start Command:**
   ```
   npm start
   ```

3. **Node Version:** (if available)
   - Select: `18` or `20`

4. Click **"Save"**

### Step 4: Redeploy

1. Go back to **"Deployments"** tab
2. Click **"Redeploy"** or Railway will auto-redeploy after saving settings
3. Wait for the build to complete

## Alternative: Check package.json Location

Make sure Railway can find `backend/package.json`. If it still fails:

1. Go to **Settings** → **Root Directory**
2. Make sure it's set to: `backend` (exactly, no trailing slash)
3. Save and redeploy

## Expected Result

After fixing:
- ✅ Build should succeed
- ✅ Service will start
- ✅ You'll get a public URL

## If Still Failing

Check the logs:
1. Go to **"Deployments"** tab
2. Click **"View logs"** on the failed deployment
3. Look for specific error messages
4. Share the error if you need help fixing it

