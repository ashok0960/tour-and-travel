from django.urls import path
from .views import TourListView, TourDetailView, ReviewCreateView, TourReviewsView

urlpatterns = [
    path('', TourListView.as_view(), name='tour-list'),
    path('<int:pk>/', TourDetailView.as_view(), name='tour-detail'),
    path('<int:tour_id>/reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('<int:tour_id>/reviews/list/', TourReviewsView.as_view(), name='review-list'),
]