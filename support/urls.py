from django.urls import path
from .views import CreateTicketView, MyTicketsView, AllTicketsView, VendorTicketsView, RespondTicketView, DeleteTicketView

urlpatterns = [
    path('create/', CreateTicketView.as_view(), name='create-ticket'),
    path('my-tickets/', MyTicketsView.as_view(), name='my-tickets'),
    path('admin/all/', AllTicketsView.as_view(), name='all-tickets'),
    path('vendor/tickets/', VendorTicketsView.as_view(), name='vendor-tickets'),
    path('<int:pk>/respond/', RespondTicketView.as_view(), name='respond-ticket'),
    path('<int:pk>/delete/', DeleteTicketView.as_view(), name='delete-ticket'),
]
