from django.urls import path
from . import views

urlpatterns = [
    path('booking/<str:booking_number>/', views.booking_detail, name='booking_detail'),
]