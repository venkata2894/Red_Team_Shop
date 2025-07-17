#!/bin/bash

# AI Demo Shop - Quick Start Script
# This script starts both the Django backend and React frontend servers

echo "🚀 Starting AI Demo Shop..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 0
    fi
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🔧 Starting Django Backend...${NC}"
    
    # Check if backend directory exists
    if [ ! -d "backend" ]; then
        echo -e "${RED}❌ Backend directory not found${NC}"
        return 1
    fi
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    echo -e "${BLUE}📦 Activating virtual environment...${NC}"
    source venv/bin/activate
    
    # Install dependencies if requirements.txt exists
    if [ -f "backend/requirements.txt" ]; then
        echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
        pip install -r backend/requirements.txt
    else
        echo -e "${BLUE}📦 Installing Django dependencies...${NC}"
        pip install django djangorestframework django-cors-headers Pillow requests
    fi
    
    # Navigate to backend directory
    cd backend
    
    # Run migrations
    echo -e "${BLUE}🗄️  Running database migrations...${NC}"
    python manage.py migrate
    
    # Populate data if needed
    echo -e "${BLUE}📊 Populating demo data...${NC}"
    python manage.py populate_data
    
    # Check if port 8000 is available
    if ! check_port 8000; then
        echo -e "${YELLOW}⚠️  Backend port 8000 is in use. Trying port 8001...${NC}"
        PORT=8001
    else
        PORT=8000
    fi
    
    # Start Django server
    echo -e "${GREEN}🚀 Starting Django server on port $PORT...${NC}"
    python manage.py runserver 127.0.0.1:$PORT &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    # Return to root directory
    cd ..
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if backend started successfully
    if curl -s http://127.0.0.1:$PORT/api/products/ > /dev/null; then
        echo -e "${GREEN}✅ Backend started successfully on http://127.0.0.1:$PORT${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend failed to start${NC}"
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🎨 Starting React Frontend...${NC}"
    
    # Check if frontend directory exists
    if [ ! -d "frontend" ]; then
        echo -e "${RED}❌ Frontend directory not found${NC}"
        return 1
    fi
    
    # Navigate to frontend directory
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
        npm install
    fi
    
    # Check if port 3000 is available
    if ! check_port 3000; then
        echo -e "${YELLOW}⚠️  Frontend port 3000 is in use. Trying port 3001...${NC}"
        PORT=3001
    else
        PORT=3000
    fi
    
    # Start React development server
    echo -e "${GREEN}🚀 Starting React server on port $PORT...${NC}"
    PORT=$PORT npm start &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    # Return to root directory
    cd ..
    
    # Wait a moment for server to start
    sleep 5
    
    # Check if frontend started successfully
    if curl -s http://localhost:$PORT > /dev/null; then
        echo -e "${GREEN}✅ Frontend started successfully on http://localhost:$PORT${NC}"
        return 0
    else
        echo -e "${RED}❌ Frontend failed to start${NC}"
        return 1
    fi
}

# Function to check Ollama
check_ollama() {
    echo -e "${BLUE}🤖 Checking Ollama AI service...${NC}"
    
    if command -v ollama &> /dev/null; then
        if ollama list | grep -q "mistral"; then
            echo -e "${GREEN}✅ Ollama with Mistral model is available${NC}"
            echo -e "${YELLOW}💡 To start Ollama: ollama serve${NC}"
        else
            echo -e "${YELLOW}⚠️  Ollama is installed but Mistral model not found${NC}"
            echo -e "${YELLOW}💡 To install Mistral: ollama pull mistral${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Ollama not found. AI features will not work${NC}"
        echo -e "${YELLOW}💡 To install Ollama: brew install ollama${NC}"
    fi
}

# Function to cleanup on exit
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Kill backend process
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        kill $BACKEND_PID 2>/dev/null
        rm backend.pid
    fi
    
    # Kill frontend process
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        kill $FRONTEND_PID 2>/dev/null
        rm frontend.pid
    fi
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Set up trap to cleanup on script exit
trap cleanup EXIT

# Main execution
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are available${NC}"

# Start backend
if start_backend; then
    echo -e "${GREEN}✅ Backend started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start backend${NC}"
    exit 1
fi

# Start frontend
if start_frontend; then
    echo -e "${GREEN}✅ Frontend started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start frontend${NC}"
    exit 1
fi

# Check Ollama
check_ollama

echo ""
echo -e "${GREEN}🎉 AI Demo Shop is now running!${NC}"
echo "================================"
echo -e "${BLUE}🌐 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 Backend API: http://localhost:8000${NC}"
echo -e "${BLUE}📚 Documentation: README.md${NC}"
echo -e "${BLUE}🎯 Demo Users: alice/password123, bob/password123${NC}"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all servers${NC}"
echo ""

# Keep script running
wait 