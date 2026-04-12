from django.contrib import admin
from .models import *

# Register your models here.

admin.site.site_header = "Travel Agency Admin"
admin.site.site_title = "Travel Agency Admin Portal"        


admin.site.register(Booking)

class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'tours', 'booking_date', 'status')
    search_fields = ('user', 'status')