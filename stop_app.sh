#!/bin/bash

# AI Demo Shop - Stop Script
# This script stops both the Django backend and React frontend servers

echo "🛑 Stopping AI Demo Shop..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill process by PID file
kill_process() {
    local pid_file=$1
    local process_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${BLUE}🛑 Stopping $process_name (PID: $pid)...${NC}"
            kill $pid
            rm "$pid_file"
            echo -e "${GREEN}✅ $process_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $process_name process not found${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${YELLOW}⚠️  No PID file found for $process_name${NC}"
    fi
}

# Function to kill processes by port
kill_by_port() {
    local port=$1
    local process_name=$2
    
    local pids=$(lsof -ti :$port)
    if [ ! -z "$pids" ]; then
        echo -e "${BLUE}🛑 Stopping $process_name on port $port...${NC}"
        kill $pids
        echo -e "${GREEN}✅ $process_name stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  No process found on port $port${NC}"
    fi
}

# Main execution
echo -e "${BLUE}🔍 Checking for running processes...${NC}"

# Stop backend
kill_process "backend.pid" "Django Backend"
kill_by_port 8000 "Django Backend"
kill_by_port 8001 "Django Backend"

# Stop frontend
kill_process "frontend.pid" "React Frontend"
kill_by_port 3000 "React Frontend"
kill_by_port 3001 "React Frontend"

# Check for any remaining processes
echo -e "${BLUE}🔍 Checking for any remaining processes...${NC}"

# Check if any Python Django processes are running
if pgrep -f "manage.py runserver" > /dev/null; then
    echo -e "${YELLOW}⚠️  Found remaining Django processes, killing them...${NC}"
    pkill -f "manage.py runserver"
fi

# Check if any React development server processes are running
if pgrep -f "react-scripts" > /dev/null; then
    echo -e "${YELLOW}⚠️  Found remaining React processes, killing them...${NC}"
    pkill -f "react-scripts"
fi

# Check if any Node.js processes are running on our ports
if lsof -ti :3000 :3001 :8000 :8001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Found processes on our ports, killing them...${NC}"
    lsof -ti :3000 :3001 :8000 :8001 | xargs kill -9
fi

echo ""
echo -e "${GREEN}✅ All AI Demo Shop processes stopped${NC}"
echo "================================"
echo -e "${BLUE}💡 To start the app again, run: ./start_app.sh${NC}"
echo "" 