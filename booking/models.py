import uuid
from django.db import models

class Booking(models.Model):
    PC_TYPE_CHOICES = [
        ('pc_weekday', 'PC (будни)'),
        ('pc_weekend', 'PC (выходные)'),
        ('ps5_one', 'PS5 (один)'),
        ('ps5_two', 'PS5 (два)'),
    ]

    name = models.CharField('Имя клиента', max_length=100)
    phone = models.CharField('Телефон', max_length=20)
    pc_type = models.CharField('Тип места', max_length=20, choices=PC_TYPE_CHOICES)
    start_at = models.DateTimeField('Дата и время начала')
    hours = models.PositiveIntegerField('Количество часов', default=1)
    comment = models.TextField('Комментарий', blank=True)

    booking_number = models.CharField(
        'Номер бронирования',
        max_length=12,
        unique=True,
        editable=False,
    )

    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'

    def __str__(self):
        return f'{self.booking_number} — {self.name}'

    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)