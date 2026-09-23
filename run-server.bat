@echo off
echo Starting TimerHub local server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python HTTP Server
    echo Open browser to: http://localhost:8000
    echo Press Ctrl+C to stop
    echo.
    python -m http.server 8000
    goto end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Node.js HTTP Server
    echo Open browser to: http://localhost:8000
    echo Press Ctrl+C to stop
    echo.
    npx http-server
    goto end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using PHP Built-in Server
    echo Open browser to: http://localhost:8000
    echo Press Ctrl+C to stop
    echo.
    php -S localhost:8000
    goto end
)

echo ERROR: No suitable server found!
echo Please install one of:
echo - Python (https://python.org)
echo - Node.js (https://nodejs.org)
echo - PHP (https://php.net)
pause

:end
