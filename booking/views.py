import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import Booking


@csrf_exempt
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)

        booking = Booking.objects.create(
            name=data.get('name', '').strip(),
            phone=data.get('phone', '').strip(),
            pc_type=data.get('pc_type'),
            start_at=data.get('start_at'),
            hours=int(data.get('hours', 1)),
            comment=data.get('comment', '').strip(),
        )

        return JsonResponse({
            'success': True,
            'booking_number': booking.booking_number,
            'booking_id': booking.id,
            'message': 'Бронирование успешно создано',
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
        }, status=400)


@csrf_exempt
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)

        booking = Booking.objects.create(
            name=data.get('name', '').strip(),
            phone=data.get('phone', '').strip(),
            pc_type=data.get('pc_type'),
            start_at=data.get('start_at'),
            hours=int(data.get('hours', 1)),
            comment=data.get('comment', '').strip(),
        )

        return JsonResponse({
            'success': True,
            'booking_number': booking.booking_number,
            'booking_id': booking.id,
            'message': 'Бронирование успешно создано',
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
        }, status=400)


def booking_detail_api(request, booking_number):
    booking = get_object_or_404(Booking, booking_number=booking_number)

    return JsonResponse({
        'booking_number': booking.booking_number,
        'name': booking.name,
        'phone': booking.phone,
        'pc_type': booking.pc_type,
        'pc_type_display': booking.get_pc_type_display(),
        'start_at': booking.start_at.isoformat(),
        'hours': booking.hours,
        'comment': booking.comment,
        'created_at': booking.created_at.isoformat(),
    })


def booking_detail(request, booking_number):
    booking = get_object_or_404(Booking, booking_number=booking_number)
    return render(request, 'booking/booking_detail.html', {'booking': booking})
