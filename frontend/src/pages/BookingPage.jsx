import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SupportWidget from '../components/SupportWidget';

export default function BookingPage() {
  const { bookingNumber } = useParams();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f11] text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-[#17171a] border border-gray-800 rounded-3xl p-8 text-center">
          <p className="text-gray-400 text-lg">Загрузка бронирования...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f11] text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-[#17171a] border border-red-500/20 rounded-3xl p-8 text-center">
          <h1 className="text-3xl font-black mb-4">Ошибка</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-[#17171a] border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-10">
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm mb-3">
            RP Arena
          </p>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Ваше бронирование
          </h1>
          <p className="text-gray-400">
            Сохраните эту страницу или ссылку, чтобы позже вернуться к брони
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 mb-8 text-center">
          <p className="text-sm text-gray-400 mb-2">Номер бронирования</p>
          <p className="text-3xl md:text-4xl font-black text-cyan-400 tracking-widest">
            {booking.booking_number}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
            <p className="text-gray-500 mb-2">Имя</p>
            <p className="text-white text-lg font-bold">{booking.name}</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
            <p className="text-gray-500 mb-2">Телефон</p>
            <p className="text-white text-lg font-bold">{booking.phone}</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
            <p className="text-gray-500 mb-2">Тариф</p>
            <p className="text-white text-lg font-bold">{booking.pc_type_display}</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
            <p className="text-gray-500 mb-2">Количество часов</p>
            <p className="text-white text-lg font-bold">{booking.hours}</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5 md:col-span-2">
            <p className="text-gray-500 mb-2">Дата и время</p>
            <p className="text-white text-lg font-bold">
              {new Date(booking.start_at).toLocaleString('ru-RU')}
            </p>
          </div>

          {booking.comment && (
            <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-5 md:col-span-2">
              <p className="text-gray-500 mb-2">Комментарий</p>
              <p className="text-white text-lg">{booking.comment}</p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl bg-[#111114] border border-gray-800 p-5">
          <p className="text-sm text-gray-500 mb-2">Срок действия ссылки</p>
          <p className="text-white text-base font-semibold">
            До {new Date(booking.access_expires_at).toLocaleString('ru-RU')}
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 text-center px-6 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            На главную
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 px-6 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold"
          >
            Сохранить / распечатать
          </button>
        </div>
      </div>

      {booking && token && (
        <SupportWidget bookingNumber={bookingNumber} token={token} />
      )}
    </div>
  );
}