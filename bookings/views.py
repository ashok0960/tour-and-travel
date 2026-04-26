from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer
from tours.models import Tour


class IsAdminOrVendor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('admin', 'vendor')


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        tour_id = self.request.data.get('tour')
        tour = get_object_or_404(Tour, id=tour_id)
        serializer.save(user=self.request.user, tour=tour)


class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-booking_date')


class AdminAllBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminOrVendor]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Booking.objects.all().order_by('-booking_date')
        return Booking.objects.filter(tour__vendor=user).order_by('-booking_date')


class VendorBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminOrVendor]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Booking.objects.all().order_by('-booking_date')
        return Booking.objects.filter(tour__vendor=user).order_by('-booking_date')


class DeleteBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UpdateBookingStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        user = request.user
        new_status = request.data.get('status')

        if not new_status:
            return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)

        if user.role in ('admin', 'vendor'):
            if user.role == 'vendor' and booking.tour.vendor != user:
                raise PermissionDenied('You can only manage bookings for your own tours')
        else:
            if booking.user != user:
                raise PermissionDenied('Not your booking')
            if new_status != 'cancelled':
                raise PermissionDenied('Only cancellation allowed')

        Booking.objects.filter(pk=pk).update(status=new_status)
        booking.refresh_from_db()
        return Response(BookingSerializer(booking).data)


class UpdatePaymentStatusView(APIView):
    permission_classes = [IsAdminOrVendor]

    def patch(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        user = request.user

        if user.role == 'vendor' and booking.tour.vendor != user:
            raise PermissionDenied('You can only manage bookings for your own tours')

        new_payment_status = request.data.get('payment_status')
        if new_payment_status not in ('pending', 'paid', 'failed', 'refunded'):
            return Response({'error': 'Invalid payment status'}, status=status.HTTP_400_BAD_REQUEST)

        Booking.objects.filter(pk=pk).update(payment_status=new_payment_status)
        booking.refresh_from_db()
        return Response(BookingSerializer(booking).data)
