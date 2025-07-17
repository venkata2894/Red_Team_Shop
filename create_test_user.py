#!/usr/bin/env python3
"""
Create a test user for the search functionality
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append('backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_test_user():
    username = "demo_user1"
    password = "demo123"
    email = "demo1@example.com"
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"✅ User '{username}' already exists")
        return
    
    # Create the user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    print(f"✅ Created user '{username}' with password '{password}'")
    print(f"   Email: {email}")
    print(f"   User ID: {user.id}")

if __name__ == "__main__":
    create_test_user() 