from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('vendor', 'Vendor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    email = models.EmailField(unique=True, blank=False)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.role == 'admin':
            self.is_staff = True
            self.is_superuser = True
        elif self.role == 'vendor':
            self.is_staff = True
            self.is_superuser = False
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_vendor(self):
        return self.role == 'vendor'

    @property
    def has_management_access(self):
        return self.role in ('admin', 'vendor')