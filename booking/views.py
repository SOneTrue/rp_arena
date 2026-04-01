import json
from zoneinfo import ZoneInfo

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt

from .models import Booking, SupportTicket, SupportMessage


def _parse_start_at(value):
    dt = parse_datetime(value) if value else None
    if dt is None:
        return None

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("Europe/Moscow"))

    return dt


def _get_booking_by_token_or_403(booking_number, token):
    booking = get_object_or_404(Booking, booking_number=booking_number)

    if not booking.token_is_valid(token):
        return None

    return booking


def _messages_payload(ticket):
    return [
        {
            'id': msg.id,
            'author_type': msg.author_type,
            'message': msg.message,
            'created_at': msg.created_at.isoformat(),
            'is_read': msg.is_read,
        }
        for msg in ticket.messages.all().order_by('created_at')
    ]


@csrf_exempt
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'error': 'Only POST allowed',
        }, status=405)

    try:
        data = json.loads(request.body)

        start_at = _parse_start_at(data.get('start_at'))
        if start_at is None:
            return JsonResponse({
                'success': False,
                'error': 'Некорректная дата и время',
            }, status=400)

        booking = Booking.objects.create(
            name=(data.get('name') or '').strip(),
            phone=(data.get('phone') or '').strip(),
            pc_type=data.get('pc_type'),
            start_at=start_at,
            hours=int(data.get('hours', 1)),
            comment=(data.get('comment') or '').strip(),
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


@csrf_exempt
def support_messages(request, booking_number):
    token = request.GET.get('token')
    booking = _get_booking_by_token_or_403(booking_number, token)

    if not booking:
        return JsonResponse({
            'success': False,
            'error': 'Ссылка недействительна или срок доступа истёк',
        }, status=403)

    ticket, _ = SupportTicket.objects.get_or_create(booking=booking)

    return JsonResponse({
        'success': True,
        'ticket_id': ticket.id,
        'status': ticket.status,
        'messages': _messages_payload(ticket),
    }, status=200)


@csrf_exempt
def support_send_message(request, booking_number):
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'error': 'Only POST allowed',
        }, status=405)

    token = request.GET.get('token')
    booking = _get_booking_by_token_or_403(booking_number, token)

    if not booking:
        return JsonResponse({
            'success': False,
            'error': 'Ссылка недействительна или срок доступа истёк',
        }, status=403)

    try:
        data = json.loads(request.body)
        text = (data.get('message') or '').strip()

        if not text:
            return JsonResponse({
                'success': False,
                'error': 'Сообщение пустое',
            }, status=400)

        ticket, _ = SupportTicket.objects.get_or_create(booking=booking)

        SupportMessage.objects.create(
            ticket=ticket,
            author_type='user',
            message=text,
        )

        ticket.status = 'open'
        ticket.save(update_fields=['status', 'updated_at'])

        return JsonResponse({
            'success': True,
            'status': ticket.status,
            'messages': _messages_payload(ticket),
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
        }, status=400)