# 🚀 How to Start the Backend Server

## Quick Start

1. **Open a new terminal/command prompt**

2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **You should see:**
   ```
   🚀 AL-MAWRID Pharmaceuticals API Server running on port 8080
   📊 Health check: http://localhost:8080/health
   🔗 Frontend URL: http://localhost:5173
   🌍 Environment: development
   ```

5. **Verify it's working:**
   - Open browser: `http://localhost:8080/health`
   - You should see: `{"status":"ok","message":"AL-MAWRID Pharmaceuticals API is running",...}`

## Test Login

Once the backend is running, you can login with:

- **Email**: `admin@almawrid.com`
- **Password**: `admin123`

## Troubleshooting

**Port already in use?**
- Check if another service is using port 8080
- You can change the port in `backend/.env` file

**Dependencies missing?**
```bash
cd backend
npm install
```

**Need to stop the server?**
- Press `Ctrl + C` in the terminal

---

**Keep this terminal open!** The backend must be running for the frontend to work.

