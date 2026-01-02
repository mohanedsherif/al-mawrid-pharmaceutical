# Upgrade Firebase to Blaze Plan - FREE Tier Still Applies!

## Why Blaze Plan?

Firebase Cloud Functions requires the **Blaze (pay-as-you-go)** plan. **BUT** you still get:
- ✅ **FREE tier:** 2 million function invocations/month
- ✅ **FREE tier:** 400,000 GB-seconds compute time/month
- ✅ **FREE tier:** 200,000 CPU-seconds/month
- ✅ **NO charges** until you exceed these generous free limits
- ✅ Credit card required (but won't be charged for free tier usage)

## Step-by-Step Upgrade

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/al-mawrid-1/usage/details

### 2. Click "Upgrade Project"
You'll see a button to upgrade your project to Blaze plan.

### 3. Add Payment Method
- Click "Select a payment plan" → Choose "Blaze Plan"
- Add your credit card
- **You won't be charged** for free tier usage

### 4. Confirm Upgrade
- Read and accept the terms
- Click "Purchase" (even though it's free tier)

### 5. Wait for Upgrade (Takes 1-2 minutes)
- You'll see "Upgrading project..." message
- Wait for it to complete

### 6. Deploy Functions
Once upgraded, run:
```bash
firebase deploy --only functions
```

## What You Get

After upgrade, you can deploy:
- ✅ Cloud Functions (backend API)
- ✅ Cloud Run (alternative to Functions)
- ✅ All Firebase services without limits

## Free Tier Limits (Very Generous!)

For Cloud Functions:
- **Invocations:** 2 million/month FREE
- **Compute Time:** 400,000 GB-seconds/month FREE
- **CPU Time:** 200,000 CPU-seconds/month FREE

For a small/medium app, you'll likely never exceed these!

## After Upgrade

Once upgraded, your deployment will work:

```bash
# Deploy functions
firebase deploy --only functions

# Your API will be available at:
# https://us-central1-al-mawrid-1.cloudfunctions.net/api
```

## Update Frontend

After deploying functions, update your frontend API URL:

1. Create `frontend/.env.production`:
```env
VITE_API_URL=https://us-central1-al-mawrid-1.cloudfunctions.net/api
```

2. Rebuild and redeploy frontend:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## Benefits

✅ **No CORS issues** - Everything on same Firebase platform  
✅ **Auto-scaling** - Handles traffic automatically  
✅ **Integrated** - Easy Firestore, Auth access  
✅ **Free tier** - No cost for normal usage  

## Alternative: Keep Railway

If you prefer not to upgrade Firebase, just fix Railway:
1. Set `FRONTEND_URL=https://al-mawrid-1.web.app` in Railway
2. Deploy updated backend code to Railway
3. Works immediately!

But Firebase Functions is better for integration! 🚀

