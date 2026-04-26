from rest_framework import serializers
from .models import Tour, Review
import html


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'username', 'rating', 'comment', 'created_at')
        read_only_fields = ('user',)

    def validate_comment(self, value):
        return html.escape(value.strip())


class TourSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    vendor_name = serializers.CharField(source='vendor.username', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = '__all__'
        read_only_fields = ('vendor', 'created_at')

    def validate_title(self, value):
        return html.escape(value.strip())

    def validate_description(self, value):
        return html.escape(value.strip())

    def validate_location(self, value):
        return html.escape(value.strip())

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return f'http://127.0.0.1:8000{obj.image.url}'
