from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
  list_display = ('booking_number', 'name', 'phone', 'pc_type', 'start_at', 'hours', 'created_at')
  list_filter = ('pc_type', 'start_at', 'created_at')
  search_fields = ('booking_number', 'name', 'phone')
  readonly_fields = ('booking_number', 'created_at')