#!/usr/bin/env python3
"""
Test script for order placement via chat
"""

import requests
import json

def print_reply(response):
    try:
        data = response.json()
        if 'reply' in data:
            print(f"Response: {data['reply']}")
        elif 'detail' in data:
            print(f"Error: {data['detail']}")
        else:
            print(f"Response: {data}")
    except Exception as e:
        print(f"Non-JSON or unexpected response: {response.status_code} {response.text}")

def test_chat_orders():
    base_url = "http://localhost:8000/api"
    
    print("🧪 Testing Order Placement via Chat")
    print("=" * 50)
    
    # Test 1: Show products (unauthenticated)
    print("\n1. Testing 'show products' (unauthenticated):")
    response = requests.post(f"{base_url}/chat/", json={"message": "show products"})
    print_reply(response)
    
    # Test 2: Login as alice
    print("\n2. Logging in as alice:")
    login_response = requests.post(f"{base_url}/auth/login/", json={
        "username": "alice",
        "password": "password123"
    })
    token = login_response.json()['token']
    print(f"Token: {token}")
    
    # Test 3: Show products (authenticated)
    print("\n3. Testing 'show products' (authenticated):")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{base_url}/chat/", json={"message": "show products"}, headers=headers)
    print_reply(response)
    
    # Test 4: Add item to cart
    print("\n4. Testing 'add red team t-shirt to cart':")
    response = requests.post(f"{base_url}/chat/", json={"message": "add red team t-shirt to cart"}, headers=headers)
    print_reply(response)
    
    # Test 5: View cart
    print("\n5. Testing 'view cart':")
    response = requests.post(f"{base_url}/chat/", json={"message": "view cart"}, headers=headers)
    print_reply(response)
    
    # Test 6: Add another item
    print("\n6. Testing 'add 2 hacker mug to cart':")
    response = requests.post(f"{base_url}/chat/", json={"message": "add 2 hacker mug to cart"}, headers=headers)
    print_reply(response)
    
    # Test 7: View cart again
    print("\n7. Testing 'view cart' again:")
    response = requests.post(f"{base_url}/chat/", json={"message": "view cart"}, headers=headers)
    print_reply(response)
    
    # Test 8: Place order
    print("\n8. Testing 'place order':")
    response = requests.post(f"{base_url}/chat/", json={"message": "place order"}, headers=headers)
    print_reply(response)
    
    # Test 9: View cart after order
    print("\n9. Testing 'view cart' after order:")
    response = requests.post(f"{base_url}/chat/", json={"message": "view cart"}, headers=headers)
    print_reply(response)
    
    print("\n✅ Chat order placement test completed!")

if __name__ == "__main__":
    test_chat_orders() 