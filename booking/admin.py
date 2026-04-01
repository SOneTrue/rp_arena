from django.contrib import admin
from .models import Booking, SupportTicket, SupportMessage


class SupportMessageInline(admin.TabularInline):
    model = SupportMessage
    extra = 1
    fields = ('author_type', 'message', 'is_read', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_number', 'name', 'phone', 'pc_type', 'start_at', 'hours', 'created_at')
    search_fields = ('booking_number', 'name', 'phone')
    list_filter = ('pc_type', 'created_at', 'start_at')


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('booking__booking_number', 'booking__name', 'booking__phone')
    inlines = [SupportMessageInline]


@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'author_type', 'is_read', 'created_at')
    list_filter = ('author_type', 'is_read', 'created_at')
    search_fields = ('ticket__booking__booking_number', 'message')