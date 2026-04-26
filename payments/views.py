import stripe
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bookings.models import Booking

stripe.api_key = settings.STRIPE_SECRET_KEY
STRIPE_CURRENCY = 'usd'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request, booking_id):
    try:
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)

        if booking.payment_status == 'paid':
            return Response({'error': 'This booking has already been paid for'}, status=status.HTTP_400_BAD_REQUEST)

        stripe.api_key = settings.STRIPE_SECRET_KEY

        amount_cents = int(float(booking.total_price) * 100)
        frontend_url = settings.FRONTEND_URL.rstrip('/')

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': STRIPE_CURRENCY,
                    'product_data': {
                        'name': f'Tour: {booking.tour.title}',
                        'description': f'Location: {booking.tour.location} | People: {booking.number_of_people}',
                    },
                    'unit_amount': amount_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{frontend_url}/my-bookings?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{frontend_url}/payment/cancel?booking_id={booking_id}',
            client_reference_id=str(booking.id),
            metadata={
                'booking_id': str(booking.id),
                'user_id': str(request.user.id),
            },
        )

        booking.stripe_checkout_session_id = checkout_session.id
        booking.save()

        return Response({
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id,
            'booking_id': booking.id,
        }, status=status.HTTP_201_CREATED)

    except stripe.error.StripeError as e:
        return Response({'error': f'Stripe error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_status(request, booking_id):
    try:
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        return Response({
            'booking_id': booking.id,
            'payment_status': booking.payment_status,
            'status': booking.status,
            'total_price': booking.total_price,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def stripe_webhook(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

    try:
        if settings.STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        else:
            import json
            event = json.loads(payload)
    except ValueError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = (
            session.get('metadata', {}).get('booking_id')
            or session.get('client_reference_id')
        )
        if booking_id:
            try:
                booking = Booking.objects.get(id=int(booking_id))
                booking.payment_status = 'paid'
                booking.status = 'confirmed'
                booking.stripe_payment_intent_id = session.get('payment_intent')
                booking.save()
            except Booking.DoesNotExist:
                pass

    return JsonResponse({'status': 'success'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_stripe_session(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({'error': 'session_id required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == 'paid':
            booking_id = session.metadata.get('booking_id') or session.client_reference_id
            if booking_id:
                booking = Booking.objects.get(id=int(booking_id), user=request.user)
                if booking.payment_status != 'paid':
                    booking.payment_status = 'paid'
                    booking.status = 'confirmed'
                    booking.stripe_payment_intent_id = session.payment_intent
                    booking.save()
                return Response({'paid': True, 'booking_id': booking.id})
        return Response({'paid': False})
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def khalti_initiate(request, booking_id):
    try:
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)

        if booking.payment_status == 'paid':
            return Response({'error': 'This booking has already been paid for'}, status=status.HTTP_400_BAD_REQUEST)

        frontend_url = settings.FRONTEND_URL.rstrip('/')
        amount_paisa = int(float(booking.total_price) * 100)

        payload = {
            'return_url': f'{frontend_url}/payment/khalti/verify?booking_id={booking_id}',
            'website_url': frontend_url,
            'amount': amount_paisa,
            'purchase_order_id': f'booking_{booking.id}_{int(float(booking.total_price))}',
            'purchase_order_name': f'{booking.tour.title} - {booking.number_of_people} person(s)',
        }

        headers = {
            'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }

        response = requests.post(
            settings.KHALTI_INITIATE_URL,
            json=payload,
            headers=headers,
            timeout=30
        )
        data = response.json()

        if response.status_code == 200 and data.get('payment_url'):
            return Response({
                'payment_url': data['payment_url'],
                'pidx': data.get('pidx'),
                'booking_id': booking.id,
            }, status=status.HTTP_201_CREATED)

        error_msg = (
            data.get('detail')
            or data.get('error_key')
            or data.get('message')
            or str(data)
        )
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

    except requests.exceptions.ConnectionError:
        return Response({'error': 'Cannot connect to Khalti. Check your internet connection.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def khalti_verify(request, booking_id):
    try:
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)

        if booking.payment_status == 'paid':
            return Response({'message': 'Already paid', 'booking_id': booking.id})

        pidx = request.data.get('pidx')
        if not pidx:
            return Response({'error': 'pidx is required'}, status=status.HTTP_400_BAD_REQUEST)

        headers = {
            'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }

        response = requests.post(
            settings.KHALTI_VERIFY_URL,
            json={'pidx': pidx},
            headers=headers,
            timeout=30
        )
        data = response.json()

        if response.status_code == 200 and data.get('status') == 'Completed':
            booking.payment_status = 'paid'
            booking.status = 'confirmed'
            booking.stripe_payment_intent_id = pidx
            booking.save()
            return Response({'message': 'Payment verified successfully', 'booking_id': booking.id})

        return Response(
            {'error': f"Payment not completed. Status: {data.get('status', 'Unknown')}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except requests.exceptions.ConnectionError:
        return Response({'error': 'Cannot connect to Khalti.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
