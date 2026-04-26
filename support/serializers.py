from rest_framework import serializers
from .models import SupportTicket


class SupportTicketSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_email = serializers.CharField(source='sender.email', read_only=True)

    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ('sender', 'sender_role', 'created_at', 'updated_at')
