from rest_framework import serializers
from .models import Tour, Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ('id', 'user', 'username', 'tour', 'rating', 'comment', 'created_at')
        read_only_fields = ('user', 'created_at')

class TourSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()  
    
    class Meta:
        model = Tour
        fields = ('id', 'title', 'description', 'location', 'price', 'duration', 'image', 'created_at', 'reviews', 'average_rating')
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(r.rating for r in reviews) / len(reviews)
        return 0
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None