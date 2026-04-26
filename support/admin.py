from django.contrib import admin
from .models import SupportTicket

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'sender_role', 'subject', 'status', 'created_at')
    list_filter = ('status', 'sender_role')
