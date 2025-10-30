@echo off
echo Creating PostgreSQL database...
echo.
echo Please enter this password when prompted: GK@post9966
echo.
psql -U postgres -c "CREATE DATABASE ai_doc_extractor;"
echo.
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created successfully!
) else (
    echo ! Database may already exist or there was an error
    echo   If it says "already exists", that's okay - continue!
)
echo.
pause
