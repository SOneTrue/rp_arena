import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import Booking


@csrf_exempt
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'error': 'Only POST allowed',
        }, status=405)

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
            'access_token': booking.access_token,
            'access_expires_at': booking.access_expires_at.isoformat() if booking.access_expires_at else None,
            'message': 'Бронирование успешно создано',
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
        }, status=400)


def booking_detail_api(request, booking_number):
    booking = get_object_or_404(Booking, booking_number=booking_number)
    token = request.GET.get('token')

    if not booking.token_is_valid(token):
        return JsonResponse({
            'success': False,
            'error': 'Ссылка недействительна или срок доступа истёк',
        }, status=403)

    return JsonResponse({
        'success': True,
        'booking_number': booking.booking_number,
        'name': booking.name,
        'phone': booking.phone,
        'pc_type': booking.pc_type,
        'pc_type_display': booking.get_pc_type_display(),
        'start_at': booking.start_at.isoformat(),
        'hours': booking.hours,
        'comment': booking.comment,
        'created_at': booking.created_at.isoformat(),
        'access_expires_at': booking.access_expires_at.isoformat() if booking.access_expires_at else None,
    }, status=200)