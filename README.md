# AI Demo Shop - Security Testing Platform

A comprehensive e-commerce application designed for AI security testing and red teaming exercises. This platform demonstrates various AI attack vectors and security vulnerabilities in a controlled environment.

## 🎯 Purpose

This application serves as a testing ground for:
- **Prompt Injection Attacks** (Direct, Indirect, Jailbreaking)
- **Data Poisoning** through AI knowledge base manipulation
- **Sensitive Information Leakage** from AI responses
- **AI Chatbot Security Testing**

## 🚀 Quick Start

### **One-Command Setup**
The easiest way to start the application is using the provided shell scripts:

```bash
# Start the entire application (Backend + Frontend)
./start_app.sh

# Stop the application
./stop_app.sh

# Quick restart
./stop_app.sh && ./start_app.sh
```

### **What the Start Script Does:**
1. **🔍 Checks Prerequisites** (Python 3, Node.js, npm)
2. **🔧 Sets up Backend** (Django, dependencies, database)
3. **🎨 Sets up Frontend** (React, dependencies)
4. **🤖 Checks AI Service** (Ollama availability)
5. **✅ Verifies Everything** (Tests both servers)
6. **🎉 Shows Success** (Displays URLs and login info)

### **Access URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Demo Users**: alice/password123, bob/password123

### **Stop Methods:**
- **Ctrl+C**: While start script is running (recommended)
- **Stop Script**: `./stop_app.sh`
- **Auto-Cleanup**: When start script exits

## 🏗️ Architecture

### Backend Stack
- **Django 5.2.4** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (for simplicity)
- **Pillow** - Image processing
- **Requests** - HTTP client for Ollama integration
- **CORS Headers** - Cross-origin resource sharing

### Frontend Stack
- **React 18** - Frontend framework
- **Material UI** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Node.js** - Runtime environment

### AI Integration
- **Ollama** - Local LLM server
- **Mistral** - Language model
- **Custom System Prompts** - For controlled AI behavior

## 🚀 Features

### E-commerce Functionality
- ✅ Product catalog with images
- ✅ User authentication (dummy users)
- ✅ Shopping cart management
- ✅ Order processing and history
- ✅ Product reviews and ratings
- ✅ Responsive Material UI design
- ✅ Product search with AI assistance
- ✅ Product detail pages with reviews

### AI Chatbot (Cracky)
- ✅ AI-powered customer support
- ✅ Product information assistance
- ✅ Order status queries
- ✅ System prompt integration
- ✅ Ollama/Mistral integration
- ✅ Order placement via chat
- ✅ Context-aware responses

### Red Teaming Features
- ✅ **Prompt Injection Vulnerabilities**
  - Direct prompt injection
  - Indirect injection via product reviews
  - Jailbreaking attempts
- ✅ **Data Poisoning (Search AI)**
  - Product tip upload system
  - Search knowledge base manipulation
  - Persistent data poisoning in search results
- ✅ **Sensitive Information Leakage**
  - Credit card information exposure
  - Order data leakage through AI
  - User data exposure

## 🛠️ Manual Setup Instructions

If you prefer to set up manually or the quick start script doesn't work:

### Prerequisites
- Python 3.8+
- Node.js 16+
- Ollama (optional, for AI features)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install django djangorestframework django-cors-headers Pillow requests
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Populate database with demo data:**
   ```bash
   python manage.py populate_data
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start React development server:**
   ```bash
   npm start
   ```

### AI Setup (Optional)

1. **Install Ollama:**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull Mistral model:**
   ```bash
   ollama pull mistral
   ```

3. **Start Ollama server:**
   ```bash
   ollama serve
   ```

## 👥 Demo Users

The application comes with pre-configured demo users:

| Username | Password | Role |
|----------|----------|------|
| alice | password123 | Customer |
| bob | password123 | Customer |
| charlie | password123 | Customer |
| admin | (created during setup) | Admin |

## 🛍️ Demo Products

- **The "Adversarial" Red Team T-Shirt** - $29.99
- **The "Prompt Injection" Hacker Mug** - $19.99
- **The "Root Access" Hacker Beanie** - $24.99
- **The AI Phishing Sticker Pack** - $9.99
- **The "Code Break" Hacker Cap** - $22.99
- **The "Logic Bomb" Malware Keychain** - $14.99
- **The "Model Collapse" Glitch Hoodie** - $39.99
- **The "Periodic Table of AI Exploits"** - $27.99

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details

### Cart
- `GET /api/cart/` - Get user cart
- `POST /api/cart/` - Add item to cart

### Orders
- `GET /api/orders/` - List user orders
- `GET /api/orders/{id}/` - Get order details
- `POST /api/checkout/` - Process checkout

### Reviews
- `GET /api/reviews/{product_id}/` - Get product reviews
- `POST /api/reviews/` - Create product review

### AI Chatbot
- `POST /api/chat/` - Chat with Cracky

### Search
- `POST /api/search/` - AI-powered product search

### Data Poisoning
- `POST /api/tips/` - Upload product tips

### Sensitive Data Exposure (Red Teaming)
- `GET /api/sensitive-data/` - Direct access to sensitive data

## 📁 Project Structure

```
Demo/
├── backend/                 # Django backend
│   ├── backend/            # Django project settings
│   ├── shop/              # Main app
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API views
│   │   ├── serializers.py # DRF serializers
│   │   └── urls.py        # URL routing
│   └── manage.py          # Django management
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Dependencies
├── demo_steps/            # Attack demonstration guides
├── imgs/                  # Product images
├── systemprompt.txt       # AI system prompt
├── systemprompt2.txt      # Search AI system prompt
├── start_app.sh           # Quick start script
├── stop_app.sh            # Quick stop script
└── README.md             # This file
```

## 🔒 Security Notes

⚠️ **This application is designed for educational and testing purposes only.**

- Contains intentional vulnerabilities for red teaming exercises
- Should not be deployed in production environments
- Credit card data is fictional and for demonstration only
- All security features are intentionally weakened for testing

## 📚 Documentation

- `PRODUCT_FEATURES_ROADMAP.md` - Product features and roadmap
- `demo_steps/` - Individual attack demonstration guides
  - `prompt_injection_attacks.md`
  - `data_poisoning_attacks.md`
  - `sensitive_data_exposure.md`

## 🎯 Quick Start

1. **Clone the repository**
2. **Run the start script**: `./start_app.sh`
3. **Access the application**: http://localhost:3000
4. **Log in with demo users**: alice/password123
5. **Begin testing attacks** (see demo_steps/ folder)
6. **Stop when done**: Press Ctrl+C or run `./stop_app.sh`

## 🤝 Contributing

This is a demonstration project for AI security testing. Contributions should focus on:
- Improving attack demonstrations
- Adding new vulnerability types
- Enhancing documentation
- Bug fixes and improvements

## 📄 License

This project is for educational purposes only. Use responsibly and only in controlled testing environments. 