from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/items/<int:item_id>/', views.CartItemView.as_view(), name='cart-item'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('reviews/', views.ReviewCreateView.as_view(), name='review-create'),
    path('reviews/<int:product_id>/', views.ReviewListView.as_view(), name='review-list'),
    path('chat/', views.CrackyChatView.as_view(), name='cracky-chat'),
    path('tips/', views.ProductTipUploadView.as_view(), name='product-tip-upload'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('sensitive-data/', views.SensitiveDataExposureView.as_view(), name='sensitive-data'),
    path('search/', views.PersonalizedSearchView.as_view(), name='personalized-search'),
] 