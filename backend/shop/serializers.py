from rest_framework import serializers
from .models import Product, Review, Order, OrderItem, Cart, CartItem, ProductTip
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'image_url', 'average_rating', 'review_count', 'reviews']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return sum(review.rating for review in reviews) / reviews.count()
        return 0

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_reviews(self, obj):
        reviews = obj.reviews.all().order_by('-created_at')[:5]  # Get last 5 reviews
        return ReviewSerializer(reviews, many=True, context=self.context).data

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'user_name', 'created_at']

class ProductTipSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    file_content = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductTip
        fields = ['id', 'tip_text', 'tip_file', 'user_name', 'product_name', 'created_at', 'is_poisoned', 'file_content']
        read_only_fields = ['user_name', 'product_name', 'created_at', 'is_poisoned', 'file_content']
    
    def get_file_content(self, obj):
        """Get the content of uploaded file for poisoning demonstrations"""
        return obj.get_file_content()

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'product_image_url']
    
    def get_product_image_url(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            url = obj.product.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user_name', 'created_at', 'total', 'items']

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'quantity', 'product_price', 'product_image_url']
    
    def get_product_image_url(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            url = obj.product.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total']
    
    def get_total(self, obj):
        return sum(item.quantity * item.product.price for item in obj.items.all()) 