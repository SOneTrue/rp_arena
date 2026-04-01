import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/games';

export default function GamesPage() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Все');

  const genres = ['Все', ...new Set(games.map((game) => game.genre))];

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === 'Все' || game.genre === genre;
      return matchesSearch && matchesGenre;
    });
  }, [search, genre]);

  const onlineGames = filteredGames.filter((game) => game.category === 'online');
  const singleGames = filteredGames.filter((game) => game.category === 'single');

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white">Все игры RP ARENA</h1>
            <p className="text-gray-400 mt-2">
              Полный каталог игр клуба на PC
            </p>
          </div>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-white w-fit"
          >
            Назад на главную
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <input
            type="text"
            placeholder="Поиск игры..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white"
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white"
          >
            {genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Онлайн-игры */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            🔥 Топовые онлайн-игры
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {onlineGames.map((game) => (
              <div
                key={game.id}
                className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{game.title}</h3>
                    <p className="text-sm text-cyan-400 mt-1">{game.genre}</p>
                  </div>
                  {game.clubAccount && (
                    <span className="text-[10px] uppercase tracking-wide px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Клубный аккаунт
                    </span>
                  )}
                </div>
                {game.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {game.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Одиночные игры */}
        <section>
          <h2 className="text-2xl font-bold text-pink-400 mb-6">
            🎮 Популярные одиночные игры
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {singleGames.map((game) => (
              <div
                key={game.id}
                className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 flex flex-col gap-2"
              >
                <h3 className="text-lg font-bold text-white">{game.title}</h3>
                <p className="text-sm text-pink-400 mt-1">{game.genre}</p>
                {game.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {game.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Блок про клубные аккаунты */}
        <div className="mt-12 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-3">
            Что такое клубный аккаунт?
          </h3>
          <p className="text-sm text-gray-300">
            Клубный аккаунт — это игровой профиль, который предоставляет клуб.
            С его помощью можно играть в платные игры без покупки, быстро заходить
            в игру и не беспокоиться о настройках. Удобно, просто и безопасно!
          </p>
        </div>
      </div>
    </div>
  );
}