#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from shop.models import Payment, User

def create_demo_payments():
    """Create demo payment data for existing users"""
    
    # Demo payment data
    demo_payments = [
        {
            'username': 'alice',
            'credit_card': '4111-1111-1111-1111',
            'card_type': 'Visa'
        },
        {
            'username': 'bob',
            'credit_card': '5555-5555-5555-4444',
            'card_type': 'MasterCard'
        },
        {
            'username': 'charlie',
            'credit_card': '3782-822463-10010',
            'card_type': 'American Express'
        }
    ]
    
    created_count = 0
    
    for payment_data in demo_payments:
        try:
            user = User.objects.get(username=payment_data['username'])
            
            # Create payment if it doesn't exist
            payment, created = Payment.objects.get_or_create(
                user=user,
                defaults={
                    'credit_card': payment_data['credit_card'],
                    'card_type': payment_data['card_type']
                }
            )
            
            if created:
                print(f"✅ Created payment for {user.username}: {payment_data['credit_card']}")
                created_count += 1
            else:
                print(f"ℹ️  Payment already exists for {user.username}")
                
        except User.DoesNotExist:
            print(f"❌ User {payment_data['username']} not found")
    
    print(f"\n🎉 Created {created_count} new payment records")
    print(f"📊 Total payments in system: {Payment.objects.count()}")

if __name__ == '__main__':
    create_demo_payments() 