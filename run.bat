@echo off
echo Starting Work Hours Calculator...
echo.
echo Choose an option:
echo 1. Open in default browser
echo 2. Start local server (Python required)
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Opening in browser...
    start index.html
) else if "%choice%"=="2" (
    echo Starting local server on http://localhost:8000
    echo Press Ctrl+C to stop the server
    python -m http.server 8000
) else if "%choice%"=="3" (
    echo Goodbye!
    exit
) else (
    echo Invalid choice. Opening in browser...
    start index.html
)

pause
