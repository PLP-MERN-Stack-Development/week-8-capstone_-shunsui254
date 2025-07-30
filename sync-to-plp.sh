#!/bin/bash

# MyBudgeteer - PLP Repository Sync Script
# This script syncs the main repository to the PLP submission repository

echo "🔄 Starting sync to PLP repository..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if PLP remote exists, add if not
if ! git remote get-url plp > /dev/null 2>&1; then
    echo "📡 Adding PLP remote..."
    git remote add plp https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-shunsui254.git
fi

# Ensure we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "🔀 Switching to main branch..."
    git checkout main
fi

# Push to both repositories
echo "📤 Pushing to origin (main repository)..."
git push origin main

echo "📤 Syncing to PLP repository..."
git push plp main --force

echo "✅ Sync completed successfully!"
echo "🌐 Main repository: https://github.com/shunsui254/mybudgeteer"
echo "🎓 PLP repository: https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-shunsui254"
