# 🚀 Vercel + Render Deployment Guide

## Overview
- **Frontend**: Vercel (Static hosting with CDN)
- **Backend**: Render (Node.js hosting)
- **Database**: MongoDB Atlas (already configured)

## 📋 Prerequisites
- [x] GitHub account
- [x] Vercel account (free at vercel.com)
- [x] Render account (free at render.com)
- [x] Code pushed to GitHub repository

---

## 🔧 BACKEND DEPLOYMENT (Render)

### Step 1: Deploy Backend to Render

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   ```
   Name: mybudgeteer-backend
   Environment: Node
   Runtime: Node 18
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

### Step 2: Set Environment Variables

In Render Dashboard → Environment:
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://cecilbezalel:Cb200300!@cluster0.mc5mxnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=e5c6cd1985a28d1dc231081dcc9bc7cca6730010b53ee194d667f256c84cbebc6cb4e8e6dbdbff6c3a643f67c64a0a76a04ca69b417531ece8fbf2286ee3d08fb
CLIENT_URL=https://mybudgeteer-gold.vercel.app
```

### Step 3: Deploy Backend
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Note your backend URL: `https://mybudgeteer-backend.onrender.com`

### Step 4: Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

---

## 🌐 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   ```
   Project Name: mybudgeteer
   Framework: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```

### Step 2: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```bash
Variable: VITE_API_BASE_URL
Value: https://mybudgeteer-backend.onrender.com/api
```

### Step 3: Deploy Frontend
- Click **"Deploy"**
- Wait for deployment (2-3 minutes)
- Your app is live at: `https://mybudgeteer.vercel.app`

---

## 🔄 CONNECTING FRONTEND & BACKEND

### Update Backend CORS
Once you have your Vercel URL, update the backend environment:
```bash
CLIENT_URL=https://mybudgeteer-gold.vercel.app
```

### Redeploy Backend
Render will automatically redeploy when you update environment variables.

---

## ✅ VERIFICATION CHECKLIST

### Backend Health Check
- [ ] `https://your-backend.onrender.com/api/health` returns 200
- [ ] `https://your-backend.onrender.com/api/auth/demo` returns demo data

### Frontend Functionality
- [ ] Landing page loads
- [ ] Login/Register pages work
- [ ] Demo login works (`demo@mybudgeteer.com` / `demo123`)
- [ ] Dashboard displays data
- [ ] API calls succeed (check browser console)

### Full Application Test
- [ ] Create new account
- [ ] Login with new account
- [ ] Verify empty states show for new users
- [ ] Test demo account shows full data
- [ ] Check AI insights only show for demo account

---

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Verify `CLIENT_URL` in Render environment
- Ensure `VITE_API_BASE_URL` points to correct Render URL

#### 2. 500 Errors on Backend
**Problem**: Backend crashes on startup
**Solution**:
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

#### 3. 404 on Page Refresh
**Problem**: React routes don't work on refresh
**Solution**: The `vercel.json` file should handle this automatically

#### 4. Build Failures
**Problem**: Deployment fails
**Solution**:
- Check Node.js version (use Node 18+)
- Verify package.json scripts
- Check for missing dependencies

### Getting Help
- **Render Logs**: Dashboard → Logs tab
- **Vercel Logs**: Dashboard → Functions tab
- **Browser Console**: F12 → Console tab

---

## 🎯 DEPLOYMENT COMMANDS REFERENCE

### Quick Deploy Commands
```bash
# Build and test locally first
npm run build
npm run preview

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Deploy to production"
git push origin main
```

### Environment Variable Template
```bash
# Backend (.env for Render)
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://cecilbezalel:Cb200300!@cluster0.mc5mxnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=e5c6cd1985a28d1dc231081dcc9bc7cca6730010b53ee194d667f256c84cbebc6cb4e8e6dbdbff6c3a643f67c64a0a76a04ca69b417531ece8fbf2286ee3d08fb
CLIENT_URL=https://mybudgeteer-gold.vercel.app

# Frontend (Vercel Environment Variables)
VITE_API_BASE_URL=https://mybudgeteer-backend.onrender.com/api
```

---

## 📊 EXPECTED COSTS

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Vercel** | 100GB bandwidth | $20/month Pro |
| **Render** | 750 hours/month | $7/month paid |
| **MongoDB Atlas** | 512MB storage | $9/month |
| **Domain** | Free subdomain | $10-15/year |
| **Total** | **FREE** for development | **$36-46/month** production |

---

## 🚀 SUCCESS!

Once completed, your MyBudgeteer application will be live at:
- **Frontend**: `https://mybudgeteer-gold.vercel.app`
- **Backend API**: `https://mybudgeteer-backend.onrender.com`
- **Health Check**: `https://mybudgeteer-backend.onrender.com/api/health`

**Next Steps**:
1. Share your app with users
2. Monitor performance and usage
3. Set up custom domain (optional)
4. Configure monitoring alerts

🎉 **Your MyBudgeteer app is now live and ready for users!**
