import React, { useEffect, useRef, useState } from 'react';

export default function SupportWidget({ bookingNumber, token }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  const loadMessages = async () => {
    try {
      setError('');

      const response = await fetch(
        `http://127.0.0.1:8000/api/bookings/${bookingNumber}/support/?token=${encodeURIComponent(token)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не удалось загрузить сообщения');
      }

      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки сообщений');
    }
  };

  useEffect(() => {
    if (!bookingNumber || !token) return;

    setLoading(true);
    loadMessages().finally(() => setLoading(false));

    intervalRef.current = window.setInterval(() => {
      loadMessages();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookingNumber, token]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setSending(true);
      setError('');

      const response = await fetch(
        `http://127.0.0.1:8000/api/bookings/${bookingNumber}/support/send/?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: trimmed }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не удалось отправить сообщение');
      }

      setMessages(data.messages || []);
      setText('');
    } catch (err) {
      setError(err.message || 'Ошибка отправки');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 px-5 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)]"
      >
        Поддержка
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-3xl border border-gray-800 bg-[#17171a] shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-bold text-lg">Техподдержка</h3>
            <p className="text-gray-400 text-sm">Задайте вопрос по вашему бронированию</p>
          </div>

          <div className="h-[340px] overflow-y-auto px-4 py-4 space-y-3 bg-[#111114]">
            {loading && (
              <p className="text-gray-500 text-sm">Загрузка...</p>
            )}

            {!loading && messages.length === 0 && !error && (
              <p className="text-gray-500 text-sm">
                Пока сообщений нет. Напишите первым.
              </p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.author_type === 'user'
                    ? 'ml-auto bg-cyan-500 text-black'
                    : 'mr-auto bg-gray-800 text-white'
                }`}
              >
                <p>{msg.message}</p>
                <p
                  className={`mt-2 text-[11px] ${
                    msg.author_type === 'user'
                      ? 'text-black/60'
                      : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
            ))}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          <div className="p-4 border-t border-gray-800 bg-[#17171a]">
            <div className="flex gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 min-h-[84px] resize-none rounded-2xl bg-[#111114] border border-gray-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={sending}
                className="self-end px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-60"
              >
                {sending ? '...' : '→'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}