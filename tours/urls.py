from django.urls import path
from .views import *
urlpatterns = [
    path('', TourListView.as_view(), name='tour-list'),
    path('<int:pk>/', TourDetailView.as_view(), name='tour-detail'),
    path('<int:tour_id>/reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('<int:tour_id>/reviews/list/', TourReviewsView.as_view(), name='review-list'),
    path('vendor/my-tours/', VendorToursView.as_view(), name='vendor-tours'),
    path('vendor/my-tours/<int:pk>/', VendorTourDetailView.as_view(), name='vendor-tour-detail'),
]