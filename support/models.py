from django.db import models


class SupportTicket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    )

    SENDER_ROLE_CHOICES = (
        ('user', 'User'),
        ('vendor', 'Vendor'),
    )

    RECIPIENT_ROLE_CHOICES = (
        ('vendor', 'Vendor'),
        ('admin', 'Admin'),
    )

    sender = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='sent_tickets')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    sender_role = models.CharField(max_length=10, choices=SENDER_ROLE_CHOICES)
    recipient_role = models.CharField(max_length=10, choices=RECIPIENT_ROLE_CHOICES, default='admin')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.sender_role} -> {self.recipient_role}] {self.sender.username} - {self.subject}"
