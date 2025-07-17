#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from shop.models import Product

def add_new_products():
    """Add new products to the database"""
    
    # New products with descriptions
    new_products = [
        {
            'name': 'Prompt Injection Survivor T-Shirt',
            'price': 25.00,
            'description': 'Show off your resilience against prompt injection attacks with this stylish tee. Features a design that represents surviving various prompt manipulation techniques.'
        },
        {
            'name': 'Data Poisoning Specialist Tee',
            'price': 35.00,
            'description': 'For the experts who understand how to manipulate AI training data. This shirt celebrates the art of data poisoning and its impact on AI systems.'
        },
        {
            'name': 'Jailbreak Whisperer T-Shirt',
            'price': 34.00,
            'description': 'Master the art of AI jailbreaking with this exclusive tee. Features subtle references to various jailbreak techniques and bypass methods.'
        },
        {
            'name': 'AI Hallucination Hunter Tee',
            'price': 65.00,
            'description': 'Track down and identify AI hallucinations with this premium tee. Perfect for researchers and practitioners who work with large language models.'
        },
        {
            'name': 'RAG Poison Hoodie',
            'price': 75.00,
            'description': 'Comfortable hoodie for those who understand retrieval-augmented generation vulnerabilities. Features a design that represents poisoning knowledge bases.'
        },
        {
            'name': 'LLM Red Team Hoodie',
            'price': 85.00,
            'description': 'Premium hoodie for red team professionals who test large language models. Features advanced security testing motifs and techniques.'
        },
        {
            'name': 'Unfiltered Output Hoodie',
            'price': 34.00,
            'description': 'Celebrate bypassing AI content filters with this comfortable hoodie. Perfect for researchers studying AI safety and alignment.'
        },
        {
            'name': 'Common LLM Jailbreak Prompts Poster',
            'price': 24.00,
            'description': 'Educational poster featuring common jailbreak techniques and prompts used to bypass AI safety measures. Great for security researchers.'
        },
        {
            'name': 'AI Threat Landscape Poster',
            'price': 54.00,
            'description': 'Comprehensive poster mapping the current AI threat landscape, including various attack vectors and vulnerabilities in AI systems.'
        },
        {
            'name': '"Jailbreak & Chill" Sticker',
            'price': 54.00,
            'description': 'Fun sticker collection featuring various jailbreak techniques and AI bypass methods. Perfect for laptops, water bottles, and notebooks.'
        },
        {
            'name': '"Prompt Manipulator" Laptop Sticker',
            'price': 66.00,
            'description': 'High-quality laptop sticker showcasing prompt manipulation techniques. Features a design that represents various prompt injection methods.'
        },
        {
            'name': 'AI Exploitation Mind Map Poster',
            'price': 54.00,
            'description': 'Detailed mind map poster showing the relationships between different AI exploitation techniques, from prompt injection to data poisoning.'
        },
        {
            'name': 'Jailbreak Pro Laptop Sleeve',
            'price': 23.00,
            'description': 'Protective laptop sleeve with jailbreak-themed design. Features various bypass techniques and AI manipulation methods.'
        },
        {
            'name': '"Pwn. Prompt. Repeat." Cold Brew Glass',
            'price': 49.00,
            'description': 'Stylish cold brew glass with the motto "Pwn. Prompt. Repeat." Perfect for security researchers who enjoy their coffee while testing AI systems.'
        },
        {
            'name': 'LLM Adversary\'s Shot Glass',
            'price': 43.00,
            'description': 'Shot glass for the LLM adversary in your life. Features designs representing various attack vectors against large language models.'
        },
        {
            'name': 'Alignment Bypass Hoodie',
            'price': 40.00,
            'description': 'Comfortable hoodie celebrating the art of bypassing AI alignment. Features designs representing various techniques to circumvent AI safety measures.'
        }
    ]
    
    created_count = 0
    
    for product_data in new_products:
        try:
            # Check if product already exists
            existing_product = Product.objects.filter(name=product_data['name']).first()
            
            if existing_product:
                print(f"ℹ️  Product already exists: {product_data['name']}")
                continue
            
            # Create new product
            product = Product.objects.create(
                name=product_data['name'],
                price=product_data['price'],
                description=product_data['description']
            )
            
            print(f"✅ Created: {product.name} - ${product.price}")
            created_count += 1
            
        except Exception as e:
            print(f"❌ Error creating {product_data['name']}: {str(e)}")
    
    print(f"\n🎉 Successfully created {created_count} new products")
    print(f"📊 Total products in system: {Product.objects.count()}")

if __name__ == '__main__':
    add_new_products() 