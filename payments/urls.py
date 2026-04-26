from django.urls import path
from . import views

urlpatterns = [
    # Stripe
    path('create-checkout-session/<int:booking_id>/', views.create_checkout_session, name='create-checkout-session'),
    path('status/<int:booking_id>/', views.get_payment_status, name='payment-status'),
    path('webhook/', views.stripe_webhook, name='stripe-webhook'),

    path('verify-session/', views.verify_stripe_session, name='verify-stripe-session'),
    # Khalti
    path('khalti/initiate/<int:booking_id>/', views.khalti_initiate, name='khalti-initiate'),
    path('khalti/verify/<int:booking_id>/', views.khalti_verify, name='khalti-verify'),
]
