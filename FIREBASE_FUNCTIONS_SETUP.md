# Firebase Cloud Functions Setup Guide

This guide will help you deploy your Node.js backend to Firebase Cloud Functions.

## Quick Setup

### Step 1: Copy Backend Files to Functions

Run this PowerShell script to copy necessary files:

```powershell
# Create directories
New-Item -ItemType Directory -Force -Path "functions\src\routes"
New-Item -ItemType Directory -Force -Path "functions\src\middleware"
New-Item -ItemType Directory -Force -Path "functions\src\models"

# Copy routes
Copy-Item "backend\src\routes\*.ts" -Destination "functions\src\routes\" -Force

# Copy middleware
Copy-Item "backend\src\middleware\*.ts" -Destination "functions\src\middleware\" -Force

# Copy models
Copy-Item "backend\src\models\*.ts" -Destination "functions\src\models\" -Force
```

### Step 2: Install Dependencies

```bash
cd functions
npm install
cd ..
```

### Step 3: Build Functions

```bash
cd functions
npm run build
cd ..
```

### Step 4: Deploy to Firebase

```bash
firebase deploy --only functions
```

## Update Frontend API URL

After deployment, update your frontend to use the Firebase Functions URL.

The API will be available at:
```
https://us-central1-al-mawrid-1.cloudfunctions.net/api
```

Update `frontend/src/api/axios.ts` or create `.env.production`:

```env
VITE_API_URL=https://us-central1-al-mawrid-1.cloudfunctions.net/api
```

Then rebuild and redeploy frontend:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## Advantages of Firebase Functions

✅ **No CORS issues** - Same domain/security context  
✅ **Integrated with Firebase** - Easy authentication, Firestore access  
✅ **Auto-scaling** - Handles traffic spikes automatically  
✅ **Pay-per-use** - Only pay for what you use  
✅ **Free tier** - Generous free quota for startups  

## Environment Variables

Set environment variables in Firebase:

```bash
firebase functions:config:set jwt.secret="your-secret-key" jwt.refresh_secret="your-refresh-secret"
```

Or use `.env` files (requires Firebase CLI 10+).

## Testing Locally

```bash
cd functions
npm run serve
```

This will start the Firebase emulator suite.

## Deployment Checklist

- [ ] Copy backend files to functions/src
- [ ] Install dependencies (`npm install` in functions folder)
- [ ] Build functions (`npm run build`)
- [ ] Set environment variables in Firebase
- [ ] Deploy functions (`firebase deploy --only functions`)
- [ ] Update frontend API URL
- [ ] Rebuild and redeploy frontend
- [ ] Test the API endpoints

## Important Notes

1. **Database**: The current backend uses in-memory database. For production, consider migrating to:
   - Firestore (recommended for Firebase projects)
   - Cloud SQL
   - Or keep your existing database solution

2. **Cold Starts**: Firebase Functions may have cold start delays (100-500ms). For high-traffic apps, consider:
   - Keeping functions warm with scheduled pings
   - Using Firebase Cloud Run instead (better for always-on apps)

3. **Costs**: Monitor your Firebase usage. Functions pricing:
   - 2 million invocations/month free
   - $0.40 per million after that
   - Plus compute time costs

## Alternative: Keep Railway

If you prefer to keep Railway, just deploy the updated CORS configuration:

1. Push `backend/src/server.ts` to your Railway-connected repo
2. Set `FRONTEND_URL` environment variable in Railway
3. Restart the service

Both solutions work! Firebase Functions provides better integration, but Railway may be simpler if you're already set up there.

