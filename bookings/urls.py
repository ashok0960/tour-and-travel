from django.urls import path
from .views import BookingCreateView, UserBookingsView, AdminAllBookingsView, UpdateBookingStatusView

urlpatterns = [
    path('create/', BookingCreateView.as_view(), name='booking-create'),
    path('my-bookings/', UserBookingsView.as_view(), name='user-bookings'),
    path('admin/all/', AdminAllBookingsView.as_view(), name='admin-bookings'),
    path('admin/update/<int:pk>/', UpdateBookingStatusView.as_view(), name='update-booking'),
    path('admin/status/<int:pk>/', UpdateBookingStatusView.as_view(), name='booking-status'),
    
]