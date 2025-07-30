# MyBudgeteer Deployment Guide

## 🎯 Recommended Deployment Stack

**Frontend**: Vercel
**Backend**: Railway
**Database**: MongoDB Atlas (already configured)

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas cluster running
- [ ] Environment variables documented
- [ ] Build process tested locally

## 🚀 Frontend Deployment (Vercel)

### 1. Deploy to Vercel
```bash
# Option A: Using Vercel CLI
npm i -g vercel
vercel --prod

# Option B: Connect GitHub repo to Vercel Dashboard
# Visit: https://vercel.com/new
```

### 2. Configure Environment Variables
In Vercel Dashboard > Settings > Environment Variables:
```
VITE_API_BASE_URL = https://your-backend-url.railway.app
```

### 3. Verify Deployment
- [ ] Site loads correctly
- [ ] API calls work (check browser console)
- [ ] All pages accessible

## 🔧 Backend Deployment (Railway)

### 1. Deploy to Railway
```bash
# Option A: Using Railway CLI
npm i -g @railway/cli
railway login
railway create mybudgeteer-backend
railway up

# Option B: Connect GitHub repo to Railway Dashboard
# Visit: https://railway.app/new
```

### 2. Configure Environment Variables
In Railway Dashboard > Variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secure-secret
CLIENT_URL=https://your-frontend-url.vercel.app
```

### 3. Test Backend
```bash
curl https://your-backend-url.railway.app/api/health
```

## 🔄 Alternative Deployments

### Frontend Alternatives
- **Netlify**: Use `netlify.toml` configuration
- **GitHub Pages**: Add `homepage` to package.json
- **Firebase Hosting**: `firebase init hosting`

### Backend Alternatives
- **Render**: Connect GitHub repo
- **Heroku**: Use `Procfile` configuration
- **DigitalOcean**: Use App Platform

## 🛠️ Environment Variables Reference

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mybudgeteer
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
CLIENT_URL=https://your-frontend-url.com
SESSION_SECRET=another-secure-secret
BCRYPT_ROUNDS=12
```

## 🧪 Testing Deployed Application

### Frontend Tests
- [ ] Landing page loads
- [ ] Login/Register functionality
- [ ] Demo account works
- [ ] Dashboard displays correctly
- [ ] API calls successful

### Backend Tests
```bash
# Health check
curl https://your-api-url/api/health

# Demo endpoint
curl https://your-api-url/api/auth/demo
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CLIENT_URL in backend environment
   - Check API_BASE_URL in frontend

2. **Environment Variables**
   - Ensure all required variables are set
   - Verify MongoDB connection string

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed

4. **404 Errors on Refresh**
   - Ensure SPA routing configured (vercel.json/netlify.toml)

## 📊 Performance Optimization

### Frontend
- [ ] Enable compression
- [ ] Configure CDN
- [ ] Optimize images
- [ ] Enable caching headers

### Backend
- [ ] Enable rate limiting
- [ ] Configure Redis caching
- [ ] Database indexing
- [ ] Health monitoring

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Rate limiting active
- [ ] Input validation working

## 📈 Monitoring

### Recommended Tools
- **Frontend**: Vercel Analytics
- **Backend**: Railway Metrics
- **Database**: MongoDB Atlas Monitoring
- **Uptime**: UptimeRobot or Pingdom

---

**Success**: Your MyBudgeteer application should now be live! 🎉

**Live URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.railway.app`
- Health: `https://your-api.railway.app/api/health`
