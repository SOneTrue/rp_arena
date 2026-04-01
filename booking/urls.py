from django.urls import path
from . import views

urlpatterns = [
    path('api/bookings/create/', views.create_booking, name='create_booking'),
    path('api/bookings/<str:booking_number>/', views.booking_detail_api, name='booking_detail_api'),

    path('api/bookings/<str:booking_number>/support/', views.support_messages, name='support_messages'),
    path('api/bookings/<str:booking_number>/support/send/', views.support_send_message, name='support_send_message'),
]