from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'price', 'created_at')
    search_fields = ('title', 'description')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'tour', 'rating', 'created_at')
    search_fields = ('user', 'tour')
    