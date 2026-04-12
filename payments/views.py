from django.shortcuts import render

# Create your views here.
# payments/views.py
import stripe
import logging
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bookings.models import Booking

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request, booking_id):
    """
    Create a Stripe Checkout Session for a specific booking
    """
    try:
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        
        # Check if booking is already paid
        if booking.payment_status == 'paid':
            return Response(
                {'error': 'This booking has already been paid for'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'Tour: {booking.tour.title}',
                        'description': f'{booking.tour.location} - {booking.travel_date}',
                    },
                    'unit_amount': int(booking.total_price * 100),  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',  # One-time payment (not subscription)
            success_url=f"{settings.FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/payment/cancel?booking_id={booking_id}",
            client_reference_id=str(booking.id),
            metadata={
                'booking_id': str(booking.id),
                'user_id': str(request.user.id),
                'tour_id': str(booking.tour.id),
            },
        )
        
        # Save checkout session ID to booking
        booking.stripe_checkout_session_id = checkout_session.id
        booking.save()
        
        return Response({
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id,
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    """
    Handle Stripe webhook events
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError:
        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)
    
    return Response({'status': 'success'}, status=status.HTTP_200_OK)


def handle_checkout_completed(session):
    """
    Update booking when payment is successful
    """
    try:
        booking_id = session.get('metadata', {}).get('booking_id')
        if not booking_id:
            # Fallback to client_reference_id
            booking_id = session.get('client_reference_id')
        
        if booking_id:
            booking = Booking.objects.get(id=int(booking_id))
            booking.payment_status = 'paid'
            booking.status = 'confirmed'  # Auto-confirm after payment
            booking.stripe_payment_intent_id = session.get('payment_intent')
            booking.save()
            
            logger.info(f"Booking {booking_id} marked as paid")
            
    except Booking.DoesNotExist:
        logger.error(f"Booking {booking_id} not found")
    except Exception as e:
        logger.error(f"Error handling checkout completion: {str(e)}")