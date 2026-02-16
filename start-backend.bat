@echo off
echo ========================================
echo   DeepWork OS - Quick Start
echo ========================================
echo.

echo [1/4] Checking Python...
py --version 2>nul
if %errorlevel% neq 0 (
    python --version 2>nul
    if %errorlevel% neq 0 (
        echo ERROR: Python not found! Please install Python 3.10+
        echo Download from: https://www.python.org/downloads/
        pause
        exit /b 1
    )
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=py
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
%PYTHON_CMD% -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Creating .env file...
if not exist .env (
    copy ..\.env.example .env
    echo Created .env file
) else (
    echo .env file already exists
)

echo.
echo [4/4] Starting backend server...
echo.
echo ========================================
echo   Backend running on http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

%PYTHON_CMD% -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
