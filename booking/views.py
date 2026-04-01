from django.shortcuts import get_object_or_404, render
from .models import Booking

def booking_detail(request, booking_number):
    booking = get_object_or_404(Booking, booking_number=booking_number)
    return render(request, 'booking/booking_detail.html', {'booking': booking})