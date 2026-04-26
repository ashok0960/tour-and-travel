from django.db import models
from django.conf import settings


class Tour(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(help_text='Duration in days')
    image = models.ImageField(upload_to='tours/images/', blank=True, null=True)
    available_seats = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    vendor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='tours',
        limit_choices_to={'role__in': ['vendor', 'admin']}
    )

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        count = reviews.count()
        if not count:
            return None
        return sum(r.rating for r in reviews) / count


class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.tour.title} ({self.rating})"
