from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Role & Permissions', {'fields': ('role', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_active'),
        }),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)
    readonly_fields = ('is_staff', 'is_superuser')  # auto-set by role on save


admin.site.site_header = "TravelHub Admin"
admin.site.site_title = "TravelHub Admin Portal"
admin.site.index_title = "Welcome to TravelHub Administration"
