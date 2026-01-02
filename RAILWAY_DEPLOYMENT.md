# Railway Deployment Guide

## Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - Visit: https://github.com/new
   - Create a new repository (e.g., `al-mawrid-pharmaceuticals`)
   - **Don't** initialize with README (we already have one)

2. **Push Your Code to GitHub:**
   ```bash
   # Add your GitHub repository as remote
   git remote add origin https://github.com/YOUR_USERNAME/al-mawrid-pharmaceuticals.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Go to Railway:**
   - Visit: https://railway.app
   - Sign in with GitHub

2. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository: `al-mawrid-pharmaceuticals`

3. **Configure Service:**
   - Railway will detect it's a Node.js project
   - **Root Directory:** Set to `backend`
   - **Start Command:** `npm start`
   - **Build Command:** `npm run build`

4. **Set Environment Variables:**
   - Go to your service → **Variables** tab
   - Add these variables:
     ```
     JWT_SECRET=your-super-secret-jwt-key-change-in-production
     JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
     FRONTEND_URL=https://al-mawrid-1.web.app
     NODE_ENV=production
     ```

5. **Deploy:**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Get your backend URL (e.g., `https://al-mawrid-backend.railway.app`)

### Option B: Deploy with Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize Railway:**
   ```bash
   cd backend
   railway init
   ```

4. **Set Environment Variables:**
   ```bash
   railway variables set JWT_SECRET=your-secret
   railway variables set JWT_REFRESH_SECRET=your-refresh-secret
   railway variables set FRONTEND_URL=https://al-mawrid-1.web.app
   railway variables set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

## Step 3: Update Frontend API URL

After getting your Railway backend URL:

1. **Update Frontend Environment:**
   - Create `frontend/.env.production`:
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

## Step 4: Verify Deployment

1. **Test Backend:**
   - Visit: `https://al-mawrid-backend.railway.app/health`
   - Should return: `{"status":"ok",...}`

2. **Test Frontend:**
   - Visit: https://al-mawrid-1.web.app
   - Try to login or load products
   - Check browser console for errors

## Troubleshooting

### CORS Errors

If you still see CORS errors:
1. Make sure `FRONTEND_URL` in Railway matches your Firebase hosting URL
2. Restart the Railway service
3. Check Railway logs for CORS-related errors

### Build Failures

If Railway build fails:
1. Check Railway logs
2. Make sure `backend/package.json` has correct scripts
3. Verify Node.js version (should be 18+)

### Environment Variables Not Working

1. Make sure variables are set in Railway dashboard
2. Restart the service after adding variables
3. Check variable names match exactly (case-sensitive)

## Railway Dashboard

Access your service at:
- **Dashboard:** https://railway.app/dashboard
- **Logs:** View real-time logs
- **Metrics:** Monitor performance
- **Settings:** Configure service settings

## Next Steps

✅ Backend deployed to Railway  
✅ Frontend deployed to Firebase  
✅ CORS configured correctly  
✅ Environment variables set  

Your application should now be fully functional! 🚀

