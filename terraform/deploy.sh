#!/bin/bash

# AI Demo Shop - AWS Terraform Deployment Script
# This script automates the deployment of the AI Demo Shop on AWS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the terraform directory
if [ ! -f "main.tf" ]; then
    print_error "Please run this script from the terraform directory"
    exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    print_status "Install with: curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip' && unzip awscliv2.zip && sudo ./aws/install"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    print_error "Terraform is not installed. Please install it first."
    print_status "Install with: curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - && sudo apt-add-repository 'deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main' && sudo apt-get update && sudo apt-get install terraform"
    exit 1
fi

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ] || [ ! -f ~/.ssh/id_rsa.pub ]; then
    print_warning "SSH key pair not found. Generating new key pair..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -C "ai-demo-shop-deployment"
    chmod 600 ~/.ssh/id_rsa
    chmod 644 ~/.ssh/id_rsa.pub
    print_success "SSH key pair generated"
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

print_success "All prerequisites are satisfied"

# Create terraform.tfvars if it doesn't exist
if [ ! -f "terraform.tfvars" ]; then
    print_status "Creating terraform.tfvars from example..."
    cp terraform.tfvars.example terraform.tfvars
    print_success "terraform.tfvars created. You can edit it to customize the deployment."
fi

# Initialize Terraform
print_status "Initializing Terraform..."
terraform init
print_success "Terraform initialized"

# Plan the deployment
print_status "Planning deployment..."
terraform plan
print_success "Deployment plan created"

# Ask for confirmation
echo
read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Apply the deployment
print_status "Deploying infrastructure..."
terraform apply -auto-approve
print_success "Infrastructure deployed successfully!"

# Get outputs
print_status "Getting deployment information..."
PUBLIC_IP=$(terraform output -raw public_ip)
SSH_CMD=$(terraform output -raw ssh_command)

echo
print_success "🎉 Deployment Complete!"
echo
echo "📋 Deployment Information:"
echo "=========================="
echo "Public IP: $PUBLIC_IP"
echo "SSH Command: $SSH_CMD"
echo
echo "🌐 Application URLs:"
echo "==================="
echo "Frontend: http://$PUBLIC_IP:3000"
echo "Backend: http://$PUBLIC_IP:8000"
echo "Attacks Page: http://$PUBLIC_IP:3000/attacks"
echo "Status Page: http://$PUBLIC_IP"
echo
echo "👥 Demo Users:"
echo "=============="
echo "alice / password123"
echo "bob / password123"
echo "charlie / password123"
echo
echo "🤖 AI Models:"
echo "============="
echo "Mistral: mistral:latest"
echo "Llama3: llama3:latest"
echo "Llama3.2: llama3.2:latest"
echo
echo "🔧 Management Commands:"
echo "======================"
echo "SSH into instance: $SSH_CMD"
echo "Check health: ssh -i ~/.ssh/id_rsa ubuntu@$PUBLIC_IP 'cd /opt/ai-demo-shop && ./health_check.sh'"
echo "View logs: ssh -i ~/.ssh/id_rsa ubuntu@$PUBLIC_IP 'tail -f /opt/ai-demo-shop/logs/*.log'"
echo
echo "🧹 To destroy infrastructure:"
echo "============================"
echo "terraform destroy"
echo
print_success "Your AI Demo Shop is now running on AWS! 🚀" 