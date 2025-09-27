#!/bin/bash

echo "🚀 Work Hours Calculator"
echo "======================="
echo
echo "Choose an option:"
echo "1. Open in default browser"
echo "2. Start local server (Python required)"
echo "3. Start local server (Node.js required)"
echo "4. Exit"
echo

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Opening in browser..."
        if command -v xdg-open > /dev/null; then
            xdg-open index.html
        elif command -v open > /dev/null; then
            open index.html
        else
            echo "Please open index.html manually in your browser"
        fi
        ;;
    2)
        echo "Starting Python server on http://localhost:8000"
        echo "Press Ctrl+C to stop the server"
        python3 -m http.server 8000 || python -m http.server 8000
        ;;
    3)
        echo "Starting Node.js server on http://localhost:8000"
        echo "Press Ctrl+C to stop the server"
        npx http-server -p 8000
        ;;
    4)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice. Opening in browser..."
        if command -v xdg-open > /dev/null; then
            xdg-open index.html
        elif command -v open > /dev/null; then
            open index.html
        else
            echo "Please open index.html manually in your browser"
        fi
        ;;
esac
