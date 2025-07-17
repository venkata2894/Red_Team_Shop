from django.db import models
from django.contrib.auth.models import User
import os

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='', blank=True, null=True)  # Uses MEDIA_ROOT/imgs

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class ProductTip(models.Model):
    """Model for storing user-uploaded product tips for data poisoning demonstrations"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='tips')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tip_text = models.TextField()
    tip_file = models.FileField(upload_to='uploaded_tips/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_poisoned = models.BooleanField(default=False)  # Flag for data poisoning demo
    
    def __str__(self):
        return f"Tip for {self.product.name} by {self.user.username}"
    
    def get_file_content(self):
        """Read the uploaded file content for poisoning the chatbot"""
        if self.tip_file and os.path.exists(self.tip_file.path):
            try:
                with open(self.tip_file.path, 'r', encoding='utf-8') as f:
                    return f.read()
            except Exception as e:
                return f"Error reading file: {str(e)}"
        return None

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    credit_card = models.CharField(max_length=32)  # For sensitive info leakage demo

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
