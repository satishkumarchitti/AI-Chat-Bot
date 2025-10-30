@echo off
echo ========================================
echo   AI Document Extractor - Setup
echo ========================================
echo.

echo Step 1: Renaming configuration file...
cd backend
if exist config_ready.env (
    rename config_ready.env .env
    echo ✓ Configuration file created
) else if exist .env (
    echo ✓ Configuration file already exists
) else (
    echo ✗ Error: config_ready.env not found
    pause
    exit
)
cd ..
echo.

echo Step 2: Creating database...
echo Please enter your PostgreSQL password when prompted: GK@post9966
psql -U postgres -c "CREATE DATABASE ai_doc_extractor;"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created successfully
) else (
    echo ! Database may already exist (this is okay)
)
echo.

echo Step 3: Setting up backend...
cd backend
echo Creating virtual environment...
if not exist "venv\" (
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing dependencies...
pip install -r requirements.txt
cd ..
echo ✓ Backend setup complete
echo.

echo Step 4: Setting up frontend...
cd frontend
if not exist "node_modules\" (
    echo Installing frontend dependencies (this may take a few minutes)...
    npm install
    echo ✓ Frontend dependencies installed
) else (
    echo ✓ Frontend dependencies already installed
)
cd ..
echo.

echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Your application is ready to run!
echo.
echo To start the application:
echo 1. Backend:  run "start-backend.bat"
echo 2. Frontend: run "start-frontend.bat"
echo.
echo Or you can start both now:
echo.
set /p START="Start the application now? (y/n): "
if /i "%START%"=="y" (
    echo.
    echo Starting backend...
    start cmd /k "cd backend && venv\Scripts\activate && python main.py"
    timeout /t 3
    echo Starting frontend...
    start cmd /k "cd frontend && npm start"
    echo.
    echo ✓ Both servers are starting!
    echo ✓ Frontend will open at http://localhost:3000
    echo ✓ Backend API at http://localhost:8000
)
echo.
pause
