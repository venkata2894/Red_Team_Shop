#!/usr/bin/env python3
"""
Test script for personalized search functionality
"""

import requests
import json

def test_search():
    # Test data
    base_url = "http://localhost:8000/api"
    
    # First, login to get a token
    login_data = {
        "username": "demo_user1",
        "password": "demo123"
    }
    
    print("🔐 Logging in...")
    login_response = requests.post(f"{base_url}/auth/login/", json=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json()["token"]
    print(f"✅ Login successful, token: {token[:20]}...")
    
    # Test search endpoint
    search_data = {
        "query": "I'm looking for hacker-themed clothing"
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\n🔍 Testing personalized search...")
    search_response = requests.post(f"{base_url}/search/", json=search_data, headers=headers)
    
    if search_response.status_code == 200:
        result = search_response.json()
        print("✅ Search successful!")
        print(f"Query: {result['query']}")
        print(f"Personalized: {result['personalized']}")
        print(f"Reply: {result['reply']}")
    else:
        print(f"❌ Search failed: {search_response.status_code}")
        print(search_response.text)
    
    # Test another search
    search_data2 = {
        "query": "What products do you recommend for someone who likes cybersecurity?"
    }
    
    print("\n🔍 Testing recommendation search...")
    search_response2 = requests.post(f"{base_url}/search/", json=search_data2, headers=headers)
    
    if search_response2.status_code == 200:
        result2 = search_response2.json()
        print("✅ Recommendation search successful!")
        print(f"Query: {result2['query']}")
        print(f"Personalized: {result2['personalized']}")
        print(f"Reply: {result2['reply']}")
    else:
        print(f"❌ Recommendation search failed: {search_response2.status_code}")
        print(search_response2.text)

if __name__ == "__main__":
    test_search() 