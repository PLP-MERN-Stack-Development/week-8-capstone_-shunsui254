#!/bin/bash

# MyBudgeteer Vercel + Render Deployment Script
echo "🚀 Preparing MyBudgeteer for Vercel + Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Test build locally
echo "📦 Testing frontend build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed. Please fix errors before deploying."
    exit 1
fi

# Test backend
echo "🔧 Testing backend..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Backend dependency installation failed."
    exit 1
fi
cd ..

# Cleanup
rm -rf dist

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy Backend to Render:"
echo "   - Go to render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'backend'"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repo"
echo "   - Add environment variable: VITE_API_BASE_URL"
echo ""
echo "4. Follow the complete guide in DEPLOY-VERCEL-RENDER.md"
echo ""
echo "🌐 Your app will be live at:"
echo "   Frontend: https://mybudgeteer.vercel.app"
echo "   Backend:  https://mybudgeteer-backend.onrender.com"
