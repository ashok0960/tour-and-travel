from rest_framework import serializers
from .models import *
import html


class BookingSerializer(serializers.ModelSerializer):
    tour_title = serializers.CharField(source='tour.title', read_only=True)
    tour_location = serializers.CharField(source='tour.location', read_only=True)
    tour_duration = serializers.IntegerField(source='tour.duration', read_only=True)
    tour_price = serializers.DecimalField(source='tour.price', max_digits=10, decimal_places=2, read_only=True)
    tour_image_url = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'booking_date', 'total_price',
                            'payment_status', 'stripe_payment_intent_id',
                            'stripe_checkout_session_id')

    def validate_number_of_people(self, value):
        if value < 1:
            raise serializers.ValidationError('Number of people must be at least 1')
        return value

    def get_tour_image_url(self, obj):
        if not obj.tour.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.tour.image.url)
        return f'http://127.0.0.1:8000{obj.tour.image.url}'