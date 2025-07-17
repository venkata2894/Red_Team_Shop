#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from shop.models import Order, Payment, User

def link_orders_to_payments():
    """Link existing orders to payment records"""
    
    # Get all orders that don't have payment associations
    orders_without_payment = Order.objects.filter(payment__isnull=True)
    
    if not orders_without_payment.exists():
        print("✅ All orders already have payment associations")
        return
    
    print(f"🔗 Linking {orders_without_payment.count()} orders to payment records...")
    
    updated_count = 0
    
    for order in orders_without_payment:
        try:
            # Get the payment for this user
            payment = Payment.objects.get(user=order.user)
            
            # Update the order to link to the payment
            order.payment = payment
            order.save()
            
            print(f"✅ Linked Order #{order.id} to payment for {order.user.username}")
            updated_count += 1
            
        except Payment.DoesNotExist:
            print(f"❌ No payment found for user {order.user.username}")
        except Exception as e:
            print(f"❌ Error linking Order #{order.id}: {str(e)}")
    
    print(f"\n🎉 Successfully linked {updated_count} orders to payments")
    
    # Verify the results
    orders_with_payment = Order.objects.filter(payment__isnull=False).count()
    total_orders = Order.objects.count()
    
    print(f"📊 Orders with payment: {orders_with_payment}/{total_orders}")

if __name__ == '__main__':
    link_orders_to_payments() 