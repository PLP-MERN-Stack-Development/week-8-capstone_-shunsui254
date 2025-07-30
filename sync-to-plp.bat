@echo off
REM MyBudgeteer - PLP Repository Sync Script (Windows)
REM This script syncs the main repository to the PLP submission repository

echo 🔄 Starting sync to PLP repository...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository
    pause
    exit /b 1
)

REM Check if PLP remote exists, add if not
git remote get-url plp >nul 2>&1
if errorlevel 1 (
    echo 📡 Adding PLP remote...
    git remote add plp https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-shunsui254.git
)

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i

REM Ensure we're on main branch
if not "%current_branch%"=="main" (
    echo 🔀 Switching to main branch...
    git checkout main
)

REM Push to both repositories
echo 📤 Pushing to origin (main repository)...
git push origin main

echo 📤 Syncing to PLP repository...
git push plp main --force

echo ✅ Sync completed successfully!
echo 🌐 Main repository: https://github.com/shunsui254/mybudgeteer
echo 🎓 PLP repository: https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-shunsui254

pause
