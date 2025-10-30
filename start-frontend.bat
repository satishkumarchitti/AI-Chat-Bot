@echo off
echo Starting AI Document Extractor Frontend...
echo.

cd frontend

if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Starting React development server...
echo Application will open at http://localhost:3000
echo.

npm start
