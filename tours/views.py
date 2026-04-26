from rest_framework import generics, permissions,status
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import *
from .serializers import *
from rest_framework.validators import ValidationError


class IsAdminOrVendor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('admin', 'vendor')


class IsAdminOrVendorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ('admin', 'vendor')

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        # Admin can edit any tour; vendor can only edit their own
        if request.user.role == 'admin':
            return True
        return obj.vendor == request.user


class TourListView(generics.ListCreateAPIView):
    queryset = Tour.objects.all().order_by('-created_at')
    serializer_class = TourSerializer
    permission_classes = [IsAdminOrVendorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)


class TourDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [IsAdminOrVendorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_update(self, serializer):
        serializer.save()


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        tour = Tour.objects.get(pk=self.kwargs['tour_id'])
        serializer.save(user=self.request.user, tour=tour)


class TourReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Review.objects.filter(tour_id=self.kwargs['tour_id'])


class VendorToursView(generics.ListAPIView):
    serializer_class = TourSerializer
    permission_classes = [IsAdminOrVendor]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Tour.objects.all().order_by('-created_at')
        return Tour.objects.filter(vendor=user).order_by('-created_at')


class VendorTourDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TourSerializer
    permission_classes = [IsAdminOrVendor]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Tour.objects.all()
        return Tour.objects.filter(vendor=user)
