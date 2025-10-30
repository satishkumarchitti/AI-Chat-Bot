@echo off
echo AI Document Extractor - Database Setup
echo ======================================
echo.

set /p DB_NAME="Enter database name (default: ai_doc_extractor): "
if "%DB_NAME%"=="" set DB_NAME=ai_doc_extractor

set /p DB_USER="Enter PostgreSQL username (default: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

echo.
echo Creating database '%DB_NAME%'...
echo.

psql -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database created successfully!
    echo.
    echo Next steps:
    echo 1. Update backend/.env with your database credentials
    echo 2. Run start-backend.bat to start the server
    echo.
) else (
    echo.
    echo ✗ Error creating database. Please check:
    echo - PostgreSQL is installed and running
    echo - Username and password are correct
    echo - Database doesn't already exist
    echo.
)

pause
