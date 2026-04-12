from django.db import models
from django.core.exceptions import ValidationError
import django.utils as timezone

# Create your models here.

def validate_not_past(value):
    if value < timezone.now().date():
        raise ValidationError("Travel date cannot be in the past.")
    

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending Payment'),
        ('paid', 'Paid'),
        ('failed', 'Payment Failed'),
        ('refunded', 'Refunded'),
    )

    
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='bookings')
    tour = models.ForeignKey('tours.Tour', on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField(validators=[validate_not_past], auto_now_add=True)
    travel_date = models.DateField(validators=[validate_not_past], auto_now_add=True) 
    number_of_people = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True, null=True)

    
    def __str__(self):
        return f"{self.user.username} - {self.tour.title} - {self.status}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.tour.price * self.number_of_people
        super().save(*args, **kwargs)