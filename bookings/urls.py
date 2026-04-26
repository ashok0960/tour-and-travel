from django.urls import path
from .views import *

urlpatterns = [
    path('create/', BookingCreateView.as_view(), name='booking-create'),
    path('my-bookings/', UserBookingsView.as_view(), name='user-bookings'),
    path('vendor/bookings/', VendorBookingsView.as_view(), name='vendor-bookings'),
    path('admin/all/', AdminAllBookingsView.as_view(), name='admin-bookings'),
    path('admin/status/<int:pk>/', UpdateBookingStatusView.as_view(), name='booking-status'),
    path('admin/payment-status/<int:pk>/', UpdatePaymentStatusView.as_view(), name='booking-payment-status'),
    path('<int:pk>/delete/', DeleteBookingView.as_view(), name='booking-delete'),
]