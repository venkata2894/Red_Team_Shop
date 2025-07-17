#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    git \
    curl \
    wget \
    unzip \
    nginx \
    certbot \
    python3-certbot-nginx

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Create application directory
mkdir -p /opt/ai-demo-shop
cd /opt/ai-demo-shop

# Clone the application (you'll need to replace with your actual repo)
# For now, we'll create a placeholder structure
mkdir -p backend frontend

# Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install django djangorestframework django-cors-headers Pillow requests

# Set up Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Create systemd service for Ollama
cat > /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama AI Service
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/local/bin/ollama serve
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start Ollama
systemctl enable ollama
systemctl start ollama

# Pull AI models
ollama pull mistral
ollama pull llama3

# Create application startup script
cat > /opt/ai-demo-shop/start_app.sh << 'EOF'
#!/bin/bash

cd /opt/ai-demo-shop

# Start backend
cd backend
source ../venv/bin/activate
python manage.py migrate
python manage.py populate_data &
cd ..

# Start frontend
cd frontend
npm install
npm start &
cd ..

# Wait for services to start
sleep 30

echo "AI Demo Shop is starting..."
echo "Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "Backend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000"
echo "Attacks Page: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000/attacks"
EOF

chmod +x /opt/ai-demo-shop/start_app.sh

# Create a simple deployment script
cat > /opt/ai-demo-shop/deploy.sh << 'EOF'
#!/bin/bash

cd /opt/ai-demo-shop

# Stop existing processes
pkill -f "python manage.py runserver"
pkill -f "npm start"

# Update from git (if using git)
# git pull origin main

# Install/update dependencies
source venv/bin/activate
pip install -r backend/requirements.txt

cd frontend
npm install
cd ..

# Start the application
./start_app.sh
EOF

chmod +x /opt/ai-demo-shop/deploy.sh

# Create a health check script
cat > /opt/ai-demo-shop/health_check.sh << 'EOF'
#!/bin/bash

# Check if services are running
echo "=== Health Check ==="
echo "Ollama Status: $(systemctl is-active ollama)"
echo "Models Available:"
ollama list

echo ""
echo "Port Status:"
netstat -tlnp | grep -E ':(3000|8000|11434)'

echo ""
echo "Process Status:"
ps aux | grep -E '(python|node|npm)' | grep -v grep
EOF

chmod +x /opt/ai-demo-shop/health_check.sh

# Set up log rotation
cat > /etc/logrotate.d/ai-demo-shop << EOF
/opt/ai-demo-shop/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 644 ubuntu ubuntu
}
EOF

# Create logs directory
mkdir -p /opt/ai-demo-shop/logs

# Set proper permissions
chown -R ubuntu:ubuntu /opt/ai-demo-shop

# Create a welcome message
cat > /opt/ai-demo-shop/README.md << 'EOF'
# AI Demo Shop - AWS Deployment

## Quick Start
1. SSH into the instance: `ssh -i your-key.pem ubuntu@<public-ip>`
2. Navigate to app: `cd /opt/ai-demo-shop`
3. Start the app: `./start_app.sh`
4. Check health: `./health_check.sh`

## URLs
- Frontend: http://<public-ip>:3000
- Backend: http://<public-ip>:8000
- Attacks Page: http://<public-ip>:3000/attacks

## Demo Users
- alice/password123
- bob/password123
- charlie/password123

## AI Models
- Mistral: Available via Ollama
- Llama3: Available via Ollama

## Useful Commands
- Check Ollama: `ollama list`
- Test AI: `ollama run mistral "Hello"`
- View logs: `tail -f /opt/ai-demo-shop/logs/*.log`
- Restart services: `./deploy.sh`
EOF

# Create a simple status page
cat > /var/www/html/status.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>AI Demo Shop Status</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .running { background-color: #d4edda; color: #155724; }
        .stopped { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>AI Demo Shop Status</h1>
    <div class="status running">✅ Ollama AI Service: Running</div>
    <div class="status running">✅ Django Backend: Running on port 8000</div>
    <div class="status running">✅ React Frontend: Running on port 3000</div>
    <hr>
    <h2>Access URLs</h2>
    <ul>
        <li><a href="http://<PUBLIC_IP>:3000">Frontend Application</a></li>
        <li><a href="http://<PUBLIC_IP>:8000">Backend API</a></li>
        <li><a href="http://<PUBLIC_IP>:3000/attacks">Attacks Page</a></li>
    </ul>
    <hr>
    <h2>Demo Users</h2>
    <ul>
        <li>alice / password123</li>
        <li>bob / password123</li>
        <li>charlie / password123</li>
    </ul>
</body>
</html>
EOF

# Replace placeholder with actual IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
sed -i "s/<PUBLIC_IP>/$PUBLIC_IP/g" /var/www/html/status.html

# Start the application
cd /opt/ai-demo-shop
./start_app.sh

echo "=== AI Demo Shop AWS Deployment Complete ==="
echo "Public IP: $PUBLIC_IP"
echo "Frontend: http://$PUBLIC_IP:3000"
echo "Backend: http://$PUBLIC_IP:8000"
echo "Attacks: http://$PUBLIC_IP:3000/attacks"
echo "Status: http://$PUBLIC_IP"
echo ""
echo "SSH: ssh -i your-key.pem ubuntu@$PUBLIC_IP"
echo "Health Check: ssh -i your-key.pem ubuntu@$PUBLIC_IP 'cd /opt/ai-demo-shop && ./health_check.sh'" 