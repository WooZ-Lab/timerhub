#!/bin/bash

echo "Starting TimerHub local server..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP Server"
    echo "Open browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    python3 -m http.server 8000
    exit 0
fi

# Check if Python is available
if command -v python &> /dev/null; then
    echo "Using Python HTTP Server"
    echo "Open browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    python -m http.server 8000
    exit 0
fi

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "Using Node.js HTTP Server"
    echo "Open browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    npx http-server
    exit 0
fi

# Check if PHP is available
if command -v php &> /dev/null; then
    echo "Using PHP Built-in Server"
    echo "Open browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    php -S localhost:8000
    exit 0
fi

echo "ERROR: No suitable server found!"
echo "Please install one of:"
echo "- Python (https://python.org)"
echo "- Node.js (https://nodejs.org)"
echo "- PHP (https://php.net)"
exit 1
