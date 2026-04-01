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

    booking_number = models.CharField('Номер бронирования', max_length=8, unique=True)
    name = models.CharField('Имя', max_length=120)
    phone = models.CharField('Телефон', max_length=30)
    pc_type = models.CharField('Тип места', max_length=20, choices=PC_TYPES)
    start_at = models.DateTimeField('Дата и время')
    hours = models.PositiveIntegerField('Количество часов', default=1)
    comment = models.TextField('Комментарий', blank=True)

    access_token = models.CharField(
        'Токен доступа',
        max_length=120,
        unique=True,
        null=True,
        blank=True,
    )
    access_expires_at = models.DateTimeField(
        'Доступ действует до',
        default=booking_token_expiry,
    )
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-created_at']

    def generate_unique_booking_number(self):
        while True:
            code = secrets.token_hex(4).upper()
            if not Booking.objects.filter(booking_number=code).exists():
                return code

    def generate_unique_access_token(self):
        while True:
            token = secrets.token_urlsafe(32)
            if not Booking.objects.filter(access_token=token).exists():
                return token

    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = self.generate_unique_booking_number()

        if not self.access_token:
            self.access_token = self.generate_unique_access_token()

        if not self.access_expires_at:
            self.access_expires_at = booking_token_expiry()

        super().save(*args, **kwargs)

    def token_is_valid(self, token):
        return (
            token
            and token == self.access_token
            and self.access_expires_at
            and timezone.now() <= self.access_expires_at
        )

    def __str__(self):
        return f'{self.booking_number} — {self.name}'


class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Открыт'),
        ('closed', 'Закрыт'),
    ]

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='support_ticket',
        verbose_name='Бронирование',
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=STATUS_CHOICES,
        default='open',
    )
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Тикет поддержки'
        verbose_name_plural = 'Тикеты поддержки'
        ordering = ['-updated_at']

    def __str__(self):
        return f'Тикет #{self.id} для {self.booking.booking_number}'


class SupportMessage(models.Model):
    AUTHOR_TYPES = [
        ('user', 'Пользователь'),
        ('admin', 'Администратор'),
    ]

    ticket = models.ForeignKey(
        SupportTicket,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Тикет',
    )
    author_type = models.CharField(
        'Автор',
        max_length=20,
        choices=AUTHOR_TYPES,
    )
    message = models.TextField('Сообщение')
    is_read = models.BooleanField('Прочитано', default=False)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Сообщение поддержки'
        verbose_name_plural = 'Сообщения поддержки'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.get_author_type_display()}: {self.message[:40]}'