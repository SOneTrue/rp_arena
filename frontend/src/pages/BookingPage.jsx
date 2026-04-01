import React, {useEffect, useState} from 'react';
import {Link, useParams, useLocation} from 'react-router-dom';

export default function BookingPage() {
    const {bookingNumber} = useParams();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchBooking = async () => {
        try {
          if (!token) {
            throw new Error('Отсутствует токен доступа');
          }

          const response = await fetch(
            `http://127.0.0.1:8000/api/bookings/${bookingNumber}/?token=${encodeURIComponent(token)}`
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Не удалось загрузить бронирование');
          }

          setBooking(data);
        } catch (err) {
          setError(err.message || 'Ошибка загрузки');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }, [bookingNumber, token]);

if (loading) return <div className="text-white p-10">Загрузка...</div>;
if (error) return <div className="text-red-400 p-10">{error}</div>;

return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-6">
        <div className="max-w-3xl mx-auto bg-[#17171a] border border-gray-800 rounded-3xl p-8">
            <h1 className="text-4xl font-black mb-6">Ваше бронирование</h1>
            <p className="mb-2"><strong>Номер:</strong> {booking.booking_number}</p>
            <p className="mb-2"><strong>Имя:</strong> {booking.name}</p>
            <p className="mb-2"><strong>Телефон:</strong> {booking.phone}</p>
            <p className="mb-2"><strong>Тариф:</strong> {booking.pc_type_display}</p>
            <p className="mb-2"><strong>Дата:</strong> {new Date(booking.start_at).toLocaleString('ru-RU')}</p>
            <p className="mb-2"><strong>Часы:</strong> {booking.hours}</p>
            {booking.comment && <p className="mb-2"><strong>Комментарий:</strong> {booking.comment}</p>}
            <p className="mt-6 text-sm text-gray-400">
                Ссылка действует до {new Date(booking.access_expires_at).toLocaleString('ru-RU')}
            </p>
            <Link to="/" className="inline-block mt-6 text-cyan-400 underline">
                На главную
            </Link>
        </div>
    </div>
);
}