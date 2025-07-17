#!/usr/bin/env python3
"""
Script to clear uploaded tips for fresh data poisoning demonstrations.
This allows for clean demos by removing all uploaded tip files and database records.
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).parent / 'backend'
sys.path.append(str(backend_path))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from shop.models import ProductTip

def clear_uploaded_tips():
    """Clear all uploaded tips and files for fresh demo"""
    
    print("🧹 Clearing uploaded tips for fresh demo...")
    
    # Get all tips
    tips = ProductTip.objects.all()
    tip_count = tips.count()
    
    if tip_count == 0:
        print("✅ No tips to clear - already clean!")
        return
    
    print(f"📝 Found {tip_count} tips to remove...")
    
    # Remove tip files from filesystem
    tips_dir = Path(__file__).parent / 'backend' / 'uploaded_tips'
    if tips_dir.exists():
        for file_path in tips_dir.glob('*'):
            if file_path.is_file() and file_path.name != '.gitkeep':
                try:
                    file_path.unlink()
                    print(f"🗑️  Deleted file: {file_path.name}")
                except Exception as e:
                    print(f"⚠️  Could not delete {file_path.name}: {e}")
    
    # Remove tip records from database
    deleted_count = tips.delete()[0]
    print(f"🗑️  Deleted {deleted_count} tip records from database")
    
    print("✅ Tips cleared successfully!")
    print("\n📋 Demo is now ready for fresh data poisoning demonstrations.")
    print("💡 Users can now upload new tips that will poison the chatbot's knowledge base.")

if __name__ == '__main__':
    clear_uploaded_tips() 