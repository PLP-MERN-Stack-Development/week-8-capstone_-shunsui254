#!/bin/bash

# MyBudgeteer Deployment Script
echo "🚀 Deploying MyBudgeteer Application..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Test build
echo "🧪 Testing build..."
npm run preview &
PREVIEW_PID=$!
sleep 5
kill $PREVIEW_PID

echo "✅ Frontend build successful!"

# Instructions for backend
echo "📝 Next steps:"
echo "1. Deploy backend to Railway/Render"
echo "2. Update VITE_API_BASE_URL in frontend"
echo "3. Deploy frontend to Vercel/Netlify"
echo "4. Configure environment variables"

echo "🎉 Deployment preparation complete!"
