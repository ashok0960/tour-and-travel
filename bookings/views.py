from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import *
from .serializers import *
from tours.models import Tour


from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        tour_id = self.request.data.get('tour')
        tour = get_object_or_404(Tour, id=tour_id)

        serializer.save(
            user=self.request.user,
            tour=tour
        )



class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        ).order_by('-booking_date')



class AdminAllBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        return Booking.objects.all().order_by('-booking_date')



class AdminBookingUpdateView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUserRole]




class UpdateBookingStatusView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        if request.user.role != 'admin':
            if booking.user != request.user:
                raise PermissionDenied("Not your booking")

            if request.data.get("status") != "cancelled":
                raise PermissionDenied("Only cancellation allowed")

        return self.partial_update(request, *args, **kwargs)
    

