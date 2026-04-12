# payments/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/<int:booking_id>/', views.create_checkout_session, name='create-checkout-session'),
    path('webhook/', views.stripe_webhook, name='stripe-webhook'),
]