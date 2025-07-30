#!/bin/bash
# Build script for Vercel deployment

echo "🔧 Starting Vercel build process..."

# Install dependencies
npm ci

# Set environment variables for build
export NODE_ENV=production

# Build the application
npm run build

echo "✅ Build completed successfully!"

# List the output to verify
echo "📁 Build output:"
ls -la dist/

echo "🚀 Ready for deployment!"
