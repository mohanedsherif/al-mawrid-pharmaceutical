# Final Setup Checklist - AL-MAWRID Pharmaceuticals

## ✅ What's Done
- ✅ Frontend deployed to Firebase: https://al-mawrid-1.web.app
- ✅ Backend deployed to Railway: al-mawrid-pharmaceutical-production.up.railway.app
- ✅ Frontend configured to use Railway backend URL
- ✅ Port configuration fixed (8080 for Railway)

## 🔧 Final Steps to Complete Setup

### 1. Set Environment Variables in Railway (CRITICAL!)

In Railway Dashboard → Your Service → **Variables** tab, add:

```
FRONTEND_URL=https://al-mawrid-1.web.app
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
NODE_ENV=production
```

**⚠️ After adding these, Railway will auto-redeploy!**

### 2. Verify Backend is Running

Test the backend health endpoint:
```
https://al-mawrid-pharmaceutical-production.up.railway.app/health
```

Should return: `{"status":"ok",...}`

### 3. Test Frontend

1. Visit: https://al-mawrid-1.web.app
2. Hard refresh (Ctrl+Shift+R) to clear cache
3. Try to:
   - Load products (homepage)
   - Login with: `admin@almawrid.com` / `admin123`

### 4. If Still Having Issues

Check:
- ✅ Railway service shows "Online" (green dot)
- ✅ Environment variables are set correctly
- ✅ Backend deployment completed successfully
- ✅ Frontend was rebuilt and redeployed after URL change

## Expected Result

- ✅ No CORS errors in console
- ✅ Products load successfully
- ✅ Login works
- ✅ All API calls succeed

## URLs

- **Frontend:** https://al-mawrid-1.web.app
- **Backend API:** https://al-mawrid-pharmaceutical-production.up.railway.app/api
- **Backend Health:** https://al-mawrid-pharmaceutical-production.up.railway.app/health

## Default Admin Credentials

- Email: `admin@almawrid.com`
- Password: `admin123`

⚠️ Change these in production!

