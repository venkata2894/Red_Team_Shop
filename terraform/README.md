# 🚀 AI Demo Shop - AWS Terraform Deployment

This Terraform configuration automatically deploys the AI Demo Shop application on AWS EC2 with all necessary infrastructure components.

## 🎯 **What Gets Deployed**

### **Infrastructure Components:**
- ✅ **VPC** with public subnet
- ✅ **EC2 Instance** (Ubuntu 22.04)
- ✅ **Security Groups** (SSH, HTTP, HTTPS, App ports)
- ✅ **Elastic IP** for static public IP
- ✅ **Internet Gateway** for internet access
- ✅ **Route Tables** for network routing

### **Application Components:**
- ✅ **Django Backend** (Python 3)
- ✅ **React Frontend** (Node.js 18)
- ✅ **Ollama AI Service** with models
- ✅ **Nginx** web server
- ✅ **SSL/HTTPS** support (optional)

## 📋 **Prerequisites**

### **1. AWS CLI Setup**
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

### **2. SSH Key Pair**
```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Set correct permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### **3. Terraform Installation**
```bash
# Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
```

## 🚀 **Quick Deployment**

### **1. Clone and Configure**
```bash
# Navigate to terraform directory
cd terraform

# Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
```

### **2. Initialize Terraform**
```bash
terraform init
```

### **3. Plan Deployment**
```bash
terraform plan
```

### **4. Deploy Infrastructure**
```bash
terraform apply
```

### **5. Access Your Application**
After deployment completes, you'll see output like:
```
Outputs:

public_ip = "54.123.45.67"
ssh_command = "ssh -i ~/.ssh/id_rsa ubuntu@54.123.45.67"
app_urls = {
  "attacks" = "http://54.123.45.67:3000/attacks"
  "backend" = "http://54.123.45.67:8000"
  "frontend" = "http://54.123.45.67:3000"
}
```

## 🌐 **Access URLs**

Once deployed, you can access:

- **Frontend Application**: `http://<public-ip>:3000`
- **Backend API**: `http://<public-ip>:8000`
- **Attacks Page**: `http://<public-ip>:3000/attacks`
- **Status Page**: `http://<public-ip>`

## 👥 **Demo Users**

- **alice** / password123
- **bob** / password123
- **charlie** / password123

## 🤖 **AI Models Available**

- **Mistral**: `mistral:latest`
- **Llama3**: `llama3:latest`
- **Llama3.2**: `llama3.2:latest`

## 🔧 **Instance Management**

### **SSH Access**
```bash
# Connect to your instance
ssh -i ~/.ssh/id_rsa ubuntu@<public-ip>

# Navigate to application
cd /opt/ai-demo-shop

# Check status
./health_check.sh

# View logs
tail -f logs/*.log
```

### **Useful Commands**
```bash
# Check Ollama models
ollama list

# Test AI model
ollama run mistral "Hello, how are you?"

# Restart application
./deploy.sh

# Check system status
systemctl status ollama
```

## 📊 **Monitoring & Logs**

### **Application Logs**
```bash
# View application logs
tail -f /opt/ai-demo-shop/logs/*.log

# Check system logs
sudo journalctl -u ollama -f
```

### **Health Check**
```bash
# Run health check
./health_check.sh
```

## 🔒 **Security Features**

- ✅ **Encrypted EBS volumes**
- ✅ **Security groups** with minimal required ports
- ✅ **SSH key-based authentication**
- ✅ **Private VPC** with controlled access
- ✅ **Automatic security updates**

## 💰 **Cost Optimization**

### **Instance Types:**
- **Development**: `t3.medium` (~$30/month)
- **Production**: `t3.large` (~$60/month)
- **AI-Heavy**: `t3.xlarge` (~$120/month)

### **Storage:**
- **Base**: 20GB (included)
- **With Models**: 30-50GB recommended

## 🛠️ **Customization**

### **Environment Variables**
Edit `terraform.tfvars`:
```hcl
# Change instance type
instance_type = "t3.large"

# Change region
aws_region = "us-west-2"

# Increase storage
volume_size = 50
```

### **Security Groups**
Modify `main.tf` to add/remove ports:
```hcl
ingress {
  from_port   = 8080
  to_port     = 8080
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
  description = "Custom port"
}
```

## 🧹 **Cleanup**

### **Destroy Infrastructure**
```bash
# Destroy all resources
terraform destroy

# Confirm destruction
yes
```

### **Manual Cleanup**
```bash
# Remove SSH key from AWS
aws ec2 delete-key-pair --key-name ai-demo-shop-key
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **SSH Connection Failed**
   ```bash
   # Check security group
   aws ec2 describe-security-groups --group-names ai-demo-shop-web-sg
   
   # Check instance status
   aws ec2 describe-instances --instance-ids <instance-id>
   ```

2. **Application Not Starting**
   ```bash
   # SSH into instance
   ssh -i ~/.ssh/id_rsa ubuntu@<public-ip>
   
   # Check logs
   tail -f /opt/ai-demo-shop/logs/*.log
   
   # Restart services
   ./deploy.sh
   ```

3. **Ollama Models Not Loading**
   ```bash
   # Check Ollama status
   systemctl status ollama
   
   # Pull models manually
   ollama pull mistral
   ollama pull llama3
   ```

### **Support Commands**
```bash
# Get instance details
terraform output

# View logs
terraform console

# Check state
terraform show
```

## 📚 **Documentation**

- **Application Docs**: See main README.md
- **Attack Guides**: Access `/attacks` page
- **API Docs**: `http://<public-ip>:8000/api/`

## 🔄 **Updates & Maintenance**

### **Update Application**
```bash
# SSH into instance
ssh -i ~/.ssh/id_rsa ubuntu@<public-ip>

# Navigate to app
cd /opt/ai-demo-shop

# Pull updates (if using git)
git pull origin main

# Redeploy
./deploy.sh
```

### **Update Infrastructure**
```bash
# Update Terraform
terraform plan
terraform apply
```

## 🎯 **Production Considerations**

1. **Use larger instance types** for production
2. **Set up monitoring** (CloudWatch)
3. **Configure backups** for data
4. **Set up domain** and SSL certificates
5. **Implement CI/CD** pipeline
6. **Add load balancing** for high availability

---

**Happy Deploying! 🚀** 