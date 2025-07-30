# 🔐 READY-TO-USE ENVIRONMENT VARIABLES
# Copy these exact values to your deployment platforms

## 🔧 RENDER BACKEND ENVIRONMENT VARIABLES
# Go to Render Dashboard → Your Service → Environment
# Add each variable below:

NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://cecilbezalel:Cb200300!@cluster0.mc5mxnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=e5c6cd1985a28d1dc231081dcc9bc7cca6730010b53ee194d667f256c84cbebc6cb4e8e6dbdbff6c3a643f67c64a0a76a04ca69b417531ece8fbf2286ee3d08fb
CLIENT_URL=https://mybudgeteer-gold.vercel.app

## 🌐 VERCEL FRONTEND ENVIRONMENT VARIABLES
# Go to Vercel Dashboard → Settings → Environment Variables
# Add this variable:

VITE_API_BASE_URL=https://mybudgeteer-backend.onrender.com/api

## 📋 DEPLOYMENT CHECKLIST
- [ ] Backend deployed to Render with above environment variables
- [ ] Frontend deployed to Vercel with above environment variable
- [ ] Test backend health: https://mybudgeteer-backend.onrender.com/api/health
- [ ] Test frontend: https://mybudgeteer-gold.vercel.app
- [ ] Test demo login: demo@mybudgeteer.com / demo123

## 🔒 SECURITY NOTES
- JWT_SECRET is cryptographically secure (128 characters)
- MongoDB URI includes authentication and proper options
- CORS is configured for your specific frontend URL
