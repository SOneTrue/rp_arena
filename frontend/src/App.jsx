import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  DollarSign,
  MapPin,
  Gamepad2,
  Monitor,
  Clock,
  Check,
  ChevronRight,
  Menu,
  X,
  Cpu,
  Wifi,
  Coffee
} from 'lucide-react';

// --- Components ---

const HexagonIcon = ({ children, className = "" }) => (
  <div className={`relative flex items-center justify-center w-20 h-20 transition-transform duration-300 group-hover:scale-110 ${className}`}>
    <div
      className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-sm"
      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
    ></div>
    <div
      className="absolute inset-0 border border-cyan-400/50"
      style={{ clipPath: 'polygon(50% 5%, 95% 30%, 95% 70%, 50% 95%, 5% 70%, 5% 30%)' }}
    ></div>
    <div className="relative z-10 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
      {children}
    </div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, description, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group relative flex flex-col items-center p-6 bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer backdrop-blur-md hover:border-cyan-500/30 transition-colors"
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="mb-4 relative z-10">
      <HexagonIcon>
        <Icon size={32} strokeWidth={1.5} />
      </HexagonIcon>
    </div>
    <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
    <p className="text-gray-400 text-center text-sm relative z-10">{description}</p>
  </motion.div>
);

const PricingCard = ({ tier, price, features, recommended = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`relative p-8 rounded-2xl border ${
      recommended
        ? 'border-cyan-500 bg-gray-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
        : 'border-gray-800 bg-gray-900/50'
    } flex flex-col h-full`}
  >
    {recommended && (
      <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
        POPULAR
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{tier}</h3>
    <div className="text-4xl font-bold text-cyan-400 mb-6">
      {price}₽<span className="text-sm text-gray-500 font-normal">/час</span>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start text-gray-300 text-sm">
          <Check className="w-5 h-5 text-cyan-500 mr-2 shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 rounded-lg font-bold transition-all ${
        recommended
          ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
          : 'bg-gray-800 hover:bg-gray-700 text-white'
      }`}
    >
      Выбрать
    </button>
  </motion.div>
);

const GameCard = ({ title, image }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative group overflow-hidden rounded-xl aspect-video cursor-pointer"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
    <div className="absolute bottom-0 left-0 p-4">
      <h4 className="text-white font-bold text-lg">{title}</h4>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [bookingData, setBookingData] = useState({
    pcType: 'standard',
    hours: 1,
    date: new Date().toISOString().slice(0, 16)
  });

  const prices = {
    standard: 100,  // PC будни 1ч
    vip: 120,       // PC выходные 1ч
    booth: 150,     // PS5 1ч
  };

  const totalCost = prices[bookingData.pcType] * bookingData.hours;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">

      <nav className="fixed top-0 w-full z-50 bg-[#0f0f11]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded flex items-center justify-center">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              RP <span className="text-white">ARENA</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Главная', 'Услуги', 'Цены', 'Игры', 'Контакты'].map((item, idx) => {
              const ids = ['home', 'services', 'pricing', 'games', 'footer'];
              return (
                <button
                  key={idx}
                  onClick={() => scrollToSection(ids[idx])}
                  className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors uppercase tracking-wide"
                >
                  {item}
                </button>
              );
            })}
            <button
              onClick={() => scrollToSection('booking')}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            >
              Забронировать
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#1a1a1c] border-b border-gray-800 overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {['Главная', 'Услуги', 'Цены', 'Игры', 'Контакты'].map((item, idx) => {
                  const ids = ['home', 'services', 'pricing', 'games', 'footer'];
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(ids[idx])}
                      className="text-left text-gray-300 hover:text-cyan-400 py-2"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://image.qwenlm.ai/public_source/84d0f612-ff1f-43fb-816e-084a5228488a/104f70099-a50a-46f2-9341-6973afd26049.png"
            alt="Cyberpunk Interior"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f11]/80 via-[#0f0f11]/40 to-[#0f0f11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11]/80 via-transparent to-[#0f0f11]/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-cyan-400 font-bold tracking-[0.2em] mb-4 text-sm md:text-base uppercase">
              Компьютерный клуб г. Буй
            </h2>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              ТВОЯ ИГРА.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                ТВОИ ПРАВИЛА.
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
              Быстрый интернет, мощные игровые компьютеры и крутая атмосфера.
              Приходи и играй вдоволь — мы работаем каждый день.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('booking')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-1"
              >
                ЗАБРОНИРОВАТЬ ПК
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-bold text-white hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                СМОТРЕТЬ ЦЕНЫ
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="py-20 bg-[#0f0f11]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={Mail}
              title="Забронировать"
              description="Онлайн бронирование мест за пару кликов без звонков."
              onClick={() => scrollToSection('booking')}
            />
            <ServiceCard
              icon={DollarSign}
              title="Стоимость"
              description="Гибкая система тарифов и пакетных предложений."
              onClick={() => scrollToSection('pricing')}
            />
            <ServiceCard
              icon={MapPin}
              title="Как нас найти"
              description="Удобное расположение в центре города с парковкой."
              onClick={() => scrollToSection('footer')}
            />
            <ServiceCard
              icon={Gamepad2}
              title="Игры PC"
              description="Библиотека из 500+ популярных игр и новинок."
              onClick={() => scrollToSection('games')}
            />
          </div>
        </div>
      </section>

      <section id="booking" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f11] to-[#131316]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-[#1a1a1e] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Забронировать место</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Тип компьютера</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['standard', 'vip', 'booth'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setBookingData({ ...bookingData, pcType: type })}
                        className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                          bookingData.pcType === type
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {type === 'standard' ? 'PC (будни)' : type === 'vip' ? 'PC (вых.)' : 'PS5'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Дата и время</label>
                  <input
                    type="datetime-local"
                    value={bookingData.date}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Длительность: <span className="text-white font-bold">{bookingData.hours} ч.</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={bookingData.hours}
                    onChange={(e) => setBookingData({ ...bookingData, hours: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>1ч</span>
                    <span>6ч</span>
                    <span>12ч</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Итого</h3>
                  <div className="space-y-4 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Тариф</span>
                      <span className="text-white capitalize">{bookingData.pcType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Время</span>
                      <span className="text-white">{bookingData.hours} часов</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Налог</span>
                      <span className="text-white">0₽</span>
                    </div>
                    <div className="h-px bg-gray-800 my-4" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-cyan-400">К оплате</span>
                      <span className="text-white">{totalCost}₽</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group">
                  Оплатить и занять место
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0f0f11]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши Тарифы</h2>
            <p className="text-gray-400">PC и PS5 — выбери своё</p>
          </div>

          {/* PC тарифы */}
          <div className="max-w-5xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">💻 PC</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col"
              >
                <h4 className="text-xl font-bold text-white mb-1">1 час</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Будни</p>
                    <p className="text-2xl font-bold text-cyan-400">100₽</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Выходные</p>
                    <p className="text-2xl font-bold text-purple-400">120₽</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative p-6 rounded-2xl border border-cyan-500 bg-gray-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col"
              >
                <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">Популярный</div>
                <h4 className="text-xl font-bold text-white mb-1">3 часа</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Будни</p>
                    <p className="text-2xl font-bold text-cyan-400">270₽</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Выходные</p>
                    <p className="text-2xl font-bold text-purple-400">320₽</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col"
              >
                <h4 className="text-xl font-bold text-white mb-1">5 часов</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Будни</p>
                    <p className="text-2xl font-bold text-cyan-400">450₽</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Выходные</p>
                    <p className="text-2xl font-bold text-purple-400">490₽</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Дневной и ночной пакеты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold text-white">Пакет день</h4>
                  <p className="text-sm text-gray-400 mt-1">12:30 — 16:00</p>
                </div>
                <p className="text-3xl font-bold text-yellow-400">250₽</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold text-white">Пакет ночь</h4>
                  <p className="text-sm text-gray-400 mt-1">23:30 — 03:00</p>
                </div>
                <p className="text-3xl font-bold text-blue-400">250₽</p>
              </motion.div>
            </div>
          </div>

          {/* PS5 тарифы */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">🎮 PS5</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col"
              >
                <h4 className="text-xl font-bold text-white mb-1">1 час</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">1 игрок</p>
                    <p className="text-2xl font-bold text-purple-400">150₽</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">2 игрока</p>
                    <p className="text-2xl font-bold text-pink-400">200₽</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-2xl border border-purple-500 bg-gray-900/90 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col"
              >
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                <h4 className="text-xl font-bold text-white mb-1">3 часа</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">1 игрок</p>
                    <p className="text-2xl font-bold text-purple-400">300₽</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">2 игрока</p>
                    <p className="text-2xl font-bold text-pink-400">500₽</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col"
              >
                <h4 className="text-xl font-bold text-white mb-1">5 часов</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">1 игрок</p>
                    <p className="text-2xl font-bold text-purple-400">500₽</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">2 игрока</p>
                    <p className="text-2xl font-bold text-pink-400">900₽</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      <section id="games" className="py-20 bg-[#131316]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Библиотека Игр</h2>
              <p className="text-gray-400">Все популярные тайтлы установлены и готовы к запуску</p>
            </div>
            <button className="hidden md:flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
              Весь список <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Counter-Strike 2", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" },
              { title: "Dota 2", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800" },
              { title: "Valorant", img: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800" },
              { title: "PUBG: Battlegrounds", img: "https://images.unsplash.com/photo-1593305841991-05c29736560e?auto=format&fit=crop&q=80&w=800" },
              { title: "Apex Legends", img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800" },
              { title: "GTA V", img: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=800" },
              { title: "Cyberpunk 2077", img: "https://images.unsplash.com/photo-1533230635445-65d6e7369502?auto=format&fit=crop&q=80&w=800" },
              { title: "Call of Duty", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800" },
            ].map((game, idx) => (
              <GameCard key={idx} title={game.title} image={game.img} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0f0f11] border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800">
              <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                <Wifi size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Интернет 100 Мбит/с</h4>
                <p className="text-gray-400 text-sm">Оптоволокно и низкий пинг для комфортной игры без лагов.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                <Monitor size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Периферия Logitech</h4>
                <p className="text-gray-400 text-sm">Топовые мыши и механические клавиатуры во всех зонах.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800">
              <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                <Coffee size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Бар и Снэки</h4>
                <p className="text-gray-400 text-sm">Энергетики, кофе и быстрые закуски прямо за компьютером.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-[#0a0a0c] pt-20 pb-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded flex items-center justify-center">
                  <Cpu className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-wider text-white">
                  CYBER<span className="text-cyan-400">ZONE</span>
                </span>
              </div>
                <p className="text-gray-400 max-w-sm mb-6">
                  RP ARENA — компьютерный клуб с быстрым интернетом и мощными
                  игровыми компьютерами в городе Буй.
                </p>
              <div className="flex gap-4">
                {[
                  { name: 'VK', link: 'https://vk.com/rp_arena_buy' },
                ].map(social => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    {social.name[0]}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Навигация</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-cyan-400 transition-colors">Главная</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-cyan-400 transition-colors">Цены</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-cyan-400 transition-colors">Бронь</button></li>
                <li><button onClick={() => scrollToSection('games')} className="hover:text-cyan-400 transition-colors">Игры</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Контакты</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-500" />
                  <span>ул. Некрасова, 22Б, г. Буй</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-500" />
                  <span>с 12:00 до 03:00</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyan-500" />
                  <span>vk.com/rp_arena_buy</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 RP ARENA. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}