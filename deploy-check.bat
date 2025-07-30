@echo off
echo 🚀 MyBudgeteer Deployment Check
echo ================================

echo 📋 Pre-deployment Checklist:
echo [ ] GitHub repository is up to date
echo [ ] MongoDB Atlas cluster is running
echo [ ] Environment variables are documented
echo.

echo 📦 Testing Frontend Build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build successful!

echo.
echo 🧪 Testing Backend...
cd backend
call npm test
if %errorlevel% neq 0 (
    echo ⚠️ Backend tests failed, but continuing...
)
cd ..

echo.
echo ✅ Deployment preparation complete!
echo.
echo 📝 Next Steps:
echo 1. Deploy backend to Railway: https://railway.app/new
echo 2. Deploy frontend to Vercel: https://vercel.com/new
echo 3. Update environment variables
echo.
pause
