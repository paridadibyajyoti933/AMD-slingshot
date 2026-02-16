@echo off
echo ========================================
echo   DeepWork OS - Frontend
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo.
echo [2/3] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Starting frontend dev server...
echo.
echo ========================================
echo   Frontend running on http://localhost:5173
echo ========================================
echo.

call npm run dev
