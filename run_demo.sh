#!/bin/bash
# RAILSYNC Single-Command Hackathon Launcher
echo "=========================================================="
echo "🚆 Starting RAILSYNC Prototype (SIH26027)"
echo "   Ministry of Railways | Automatic Block Planning Cockpit"
echo "=========================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Start Python FastAPI Backend (Port 8000)
echo "⚡ [1/2] Launching Python FastAPI + OR-Tools Solver on http://localhost:8000..."
cd "$DIR/backend"
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 2

# 2. Start Vite React Frontend (Port 5173)
echo "🖥️ [2/2] Launching Section Controller React Cockpit on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ ALL SERVICES ACTIVE!"
echo "👉 Open your browser at: http://localhost:5173"
echo "👉 FastAPI Swagger Docs at: http://localhost:8000/docs"
echo ""
echo "Press [Ctrl+C] anytime to stop all prototype servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM EXIT
wait
