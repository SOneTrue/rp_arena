import secrets
from datetime import timedelta
from django.db import models
from django.utils import timezone


def booking_token_expiry():
    return timezone.now() + timedelta(days=7)


class Booking(models.Model):
    PC_TYPES = [
        ('pc_weekday', 'PC (будни)'),
        ('pc_weekend', 'PC (выходные)'),
        ('ps5_one', 'PS5 (1 игрок)'),
        ('ps5_two', 'PS5 (2 игрока)'),
    ]

    booking_number = models.CharField(max_length=8, unique=True)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    pc_type = models.CharField(max_length=20, choices=PC_TYPES)
    start_at = models.DateTimeField()
    hours = models.PositiveIntegerField(default=1)
    comment = models.TextField(blank=True)

    access_token = models.CharField(max_length=120, null=True, blank=True)
    access_expires_at = models.DateTimeField(default=booking_token_expiry)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = secrets.token_hex(4).upper()
        if not self.access_token:
            self.access_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def token_is_valid(self, token):
        return (
            token
            and token == self.access_token
            and self.access_expires_at
            and timezone.now() <= self.access_expires_at
        )