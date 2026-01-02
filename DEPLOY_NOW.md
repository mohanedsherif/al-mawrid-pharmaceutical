# Quick Deploy Guide - GitHub + Railway

## ✅ What's Done
- ✅ Git repository initialized
- ✅ All files committed
- ✅ Ready to push to GitHub

## 🚀 Next Steps

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `al-mawrid-pharmaceuticals` (or any name you prefer)
3. **Don't** check "Initialize with README" (we already have one)
4. Click **"Create repository"**

### Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/al-mawrid-pharmaceuticals.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Railway

1. **Go to Railway:** https://railway.app
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository** (al-mawrid-pharmaceuticals)

6. **Configure Service:**
   - Click on the new service
   - Go to **Settings** tab
   - **Root Directory:** Set to `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

7. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add these variables:
     ```
     JWT_SECRET=your-super-secret-jwt-key-change-in-production
     JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
     FRONTEND_URL=https://al-mawrid-1.web.app
     NODE_ENV=production
     ```

8. **Get Your Backend URL:**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Go to **Settings** → **Networking**
   - Generate a public domain
   - Copy the URL (e.g., `https://al-mawrid-backend.railway.app`)

### Step 4: Update Frontend

1. **Update API URL:**
   - Use the Railway backend URL you got above
   - Update frontend to use it (or we can do it automatically)

2. **Rebuild and Redeploy Frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

## 🎉 Done!

Your application will be:
- ✅ Backend: Running on Railway
- ✅ Frontend: Running on Firebase Hosting
- ✅ CORS: Fixed automatically
- ✅ Auto-deploy: Railway will deploy on every git push

## Need Help?

If you get stuck:
1. Check Railway logs for errors
2. Verify environment variables are set correctly
3. Make sure Root Directory is set to `backend`

