# 🔧 Final CORS Fix Instructions

## ✅ What's Been Done

1. ✅ Frontend code updated to use correct Railway URL
2. ✅ Frontend rebuilt and deployed to Firebase
3. ✅ Backend code configured to allow Firebase origin
4. ✅ Port changed from 8081 to 8080 in all files

## ⚠️ Current Issue

The CORS error shows the backend is returning `Access-Control-Allow-Origin: https://railway.com` instead of allowing your Firebase frontend.

## 🔴 Action Required: Railway Backend Redeploy

The backend on Railway needs to be redeployed with the correct environment variables.

### Step 1: Verify Environment Variables in Railway

1. Go to Railway dashboard: https://railway.app
2. Open your project: `al-mawrid-pharmaceutical`
3. Click on the service
4. Go to **Variables** tab
5. **Verify these variables exist:**
   - `FRONTEND_URL` = `https://al-mawrid-1.web.app`
   - `JWT_SECRET` = (your secret)
   - `JWT_REFRESH_SECRET` = (your secret)
   - `NODE_ENV` = `production`

### Step 2: Trigger Redeploy

**Option A: Automatic Redeploy**
- Railway should auto-redeploy when you update variables
- Wait 2-3 minutes and check the Deployments tab

**Option B: Manual Redeploy**
1. Go to **Settings** tab
2. Scroll to **Deployments**
3. Click **"Redeploy"** or **"Deploy Latest"**

**Option C: Push to GitHub**
```bash
git add .
git commit -m "Update backend CORS configuration"
git push origin main
```
Railway will auto-deploy on push.

### Step 3: Verify Backend is Running

1. Go to Railway **Settings** → **Networking**
2. Copy the public domain: `al-mawrid-pharmaceutical-production.up.railway.app`
3. Test the health endpoint:
   ```
   https://al-mawrid-pharmaceutical-production.up.railway.app/health
   ```
4. You should see: `{"status":"ok","message":"AL-MAWRID Pharmaceuticals API is running",...}`

### Step 4: Test Frontend Connection

1. Open your frontend: https://al-mawrid-1.web.app
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R) to clear cache
3. Open Developer Console (F12)
4. Try to login
5. Check if CORS errors are gone

## 🔍 How to Debug CORS Issues

If CORS errors persist after redeploy:

1. **Check Railway Logs:**
   - Railway Dashboard → Your Service → **Deployments** tab
   - Click on the latest deployment
   - Check logs for startup messages
   - Look for: `🚀 AL-MAWRID Pharmaceuticals API Server running on port...`
   - Look for: `🔗 Frontend URL: https://al-mawrid-1.web.app`

2. **Test CORS Manually:**
   ```bash
   curl -H "Origin: https://al-mawrid-1.web.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://al-mawrid-pharmaceutical-production.up.railway.app/api/auth/login
   ```
   
   Should return headers including:
   ```
   Access-Control-Allow-Origin: https://al-mawrid-1.web.app
   ```

3. **Check Environment Variables in Logs:**
   - Railway should print environment info on startup
   - Verify `FRONTEND_URL` is being read correctly

## 📝 Notes

- The backend code at `backend/src/server.ts` is correct
- The frontend code at `frontend/src/api/axios.ts` is correct
- The issue is Railway needs to redeploy with the new environment variables
- Port is now **8080** (changed from 8081)

## ✅ Success Indicators

After redeploy, you should see:
- ✅ No CORS errors in browser console
- ✅ Login requests succeed
- ✅ API calls work from frontend
- ✅ Backend logs show correct `FRONTEND_URL`

---

**If issues persist**, share:
1. Railway deployment logs
2. Browser console errors
3. Network tab request/response headers

