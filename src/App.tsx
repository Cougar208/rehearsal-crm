import { useState, useEffect } from 'react';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import RoomDetailsModal from './components/RoomDetailsModal';

// Импорты новых страниц
import Auth from './components/Auth';
import Profile from './components/Profile';

import type { Room, TimeSlot } from './types/Room';

const defaultSchedule: TimeSlot[] = [
  { id: "12:00", timeLabel: "12:00 - 15:00", isBooked: false },
  { id: "15:00", timeLabel: "15:00 - 18:00", isBooked: false },
  { id: "18:00", timeLabel: "18:00 - 21:00", isBooked: false },
  { id: "21:00", timeLabel: "21:00 - 00:00", isBooked: false },
];

const catalogRooms: Room[] = [
  { id: 1, name: "Красный зал «Марс»", pricePerHour: 1200, area: 30, equipment: ["Барабаны Pearl", "Стек Marshall", "Микрофоны Shure"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80", description: "Агрессивный дизайн и плотный звук. Этот зал обшит специальными звукопоглощающими панелями." },
  { id: 2, name: "Оранжевая студия «Закат»", pricePerHour: 1000, area: 25, equipment: ["Барабаны Tama", "Комбик Orange", "Синтезатор Korg"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1460036521480-c116bb1c2c36?auto=format&fit=crop&w=800&q=80", description: "Теплая ламповая атмосфера. Зал с мягким светом и отличным винтажным бэклайном." },
  { id: 3, name: "Желтая комната «Вольт»", pricePerHour: 800, area: 20, equipment: ["Электронная установка Roland", "Бас-комбо Markbass"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Зеленый цех «Матрица»", pricePerHour: 900, area: 28, equipment: ["Барабаны Mapex", "Синтезаторы Moog", "Пульт Yamaha"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1559424452-eeb3a13fe2ae?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Голубой лаунж «Океан»", pricePerHour: 1400, area: 35, equipment: ["Акустическое пианино", "Микрофоны Neumann", "Студийные мониторы"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "Синий зал «Неон»", pricePerHour: 1500, area: 40, equipment: ["Барабаны DW", "Гитарные процессоры Kemper", "Свет DMX"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?auto=format&fit=crop&w=800&q=80" },
  { id: 7, name: "Фиолетовый Premium «Космос»", pricePerHour: 2000, area: 50, equipment: ["Рояль", "Барабаны Sonor SQ2", "Топовый бэклайн", "Зона отдыха"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80" }
];

const generateNextDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      dateStr: date.toISOString().split('T')[0],
      displayFull: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
    });
  }
  return days;
};

const loadBookings = () => {
  const saved = localStorage.getItem('global_bookings_db');
  return saved ? JSON.parse(saved) : {};
};

const CATEGORIES = ['Все', 'Премиум', 'Барабаны', 'Клавиши', 'Бюджетно'];

function App() {
  // НАВИГАЦИЯ И ПОЛЬЗОВАТЕЛЬ
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'profile'>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string>('');

  // КАЛЕНДАРЬ
  const availableDays = generateNextDays();
  const [selectedDate, setSelectedDate] = useState(availableDays[0].dateStr);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // БАЗА ДАННЫХ
  const [bookingsDB, setBookingsDB] = useState<Record<string, { clientName: string, phone: string }>>(loadBookings);

  // ПОИСК И ФИЛЬТРЫ
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');

  // МОДАЛКИ
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<{ roomId: number, slotId: string } | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    localStorage.setItem('global_bookings_db', JSON.stringify(bookingsDB));
  }, [bookingsDB]);

  // ФУНКЦИИ АВТОРИЗАЦИИ
  const handleLogin = (user: any, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    setCurrentView('home');
  };

  // ФУНКЦИИ БРОНИРОВАНИЯ
  const handleSlotClick = (roomId: number, slotId: string) => {
    setActiveBooking({ roomId, slotId });
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (clientName: string, phone: string) => {
    if (!activeBooking) return;
    const { roomId, slotId } = activeBooking;
    
    // Ключ для локального отображения на сайте
    const bookingKey = `${selectedDate}_${roomId}_${slotId}`;

    // === НОВОЕ: СОБИРАЕМ ВСЕ ID ДЛЯ БЭКЕНДА ===
    const bookingId = `book_${crypto.randomUUID()}`; // Уникальный ID самой брони
    const clientId = currentUser ? currentUser.id : 'guest'; // ID клиента (или 'guest', если не вошел)

    // Полный объект, который улетит в твою БД
    const payload = {
      bookingId: bookingId,
      clientId: clientId,
      roomId: roomId,
      slotId: slotId,
      date: selectedDate,
      clientName: clientName,
      phone: phone,
      timestamp: new Date().toISOString()
    };

    try {
      
      
      const response = await fetch('https://91.108.243.250', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Ошибка сервера');
      

      // Сохраняем бронь в память сайта, чтобы слот закрасился серым
      // (также сохраняем сгенерированные ID для истории)
      setBookingsDB(prev => ({
        ...prev,
        [bookingKey]: { 
          bookingId: bookingId,
          clientId: clientId,
          clientName: clientName, 
          phone: phone 
        }
      }));

      setIsBookingModalOpen(false);
      setActiveBooking(null);
      
      // Выводим номер брони для клиента
      alert(`Супер! Зал забронирован на ${selectedDate}.\nНомер вашей брони: ${bookingId}`);

    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Произошла ошибка при отправке данных. Проверьте интернет.");
    }
  };

  // ФИЛЬТРАЦИЯ И СБОРКА КАРТОЧЕК
  const currentRooms = catalogRooms.map(room => {
    return {
      ...room,
      schedule: room.schedule.map(slot => {
        const key = `${selectedDate}_${room.id}_${slot.id}`;
        const booking = bookingsDB[key];
        return {
          ...slot,
          isBooked: !!booking,
          clientName: booking ? `${booking.clientName} (${booking.phone})` : undefined
        };
      })
    };
  });

  const filteredRooms = currentRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()));
    let matchesCategory = true;
    if (activeCategory === 'Премиум') matchesCategory = room.pricePerHour >= 1400;
    if (activeCategory === 'Барабаны') matchesCategory = room.equipment.some(eq => eq.toLowerCase().includes('барабан'));
    if (activeCategory === 'Клавиши') matchesCategory = room.equipment.some(eq => eq.toLowerCase().includes('пианино') || eq.toLowerCase().includes('рояль') || eq.toLowerCase().includes('синтезатор'));
    if (activeCategory === 'Бюджетно') matchesCategory = room.pricePerHour <= 900;
    return matchesSearch && matchesCategory;
  });

  const selectedDayObj = availableDays.find(d => d.dateStr === selectedDate);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER МЕНЮ */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setCurrentView('home')} style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', cursor: 'pointer' }}>
          <span style={{ color: '#fff' }}>РепБаза</span> <span style={{ color: '#00e5ff' }}>Спектр</span>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {currentUser ? (
            <button onClick={() => setCurrentView('profile')} style={{ backgroundColor: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              👤 Профиль ({currentUser.name})
            </button>
          ) : (
            <button onClick={() => setCurrentView('auth')} style={{ backgroundColor: '#00e5ff', border: 'none', color: '#000', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              Войти
            </button>
          )}
        </div>
      </nav>

      {/* МАРШРУТИЗАТОР ЭКРАНОВ */}
      {currentView === 'auth' && (
  <Auth 
    onLoginSuccess={handleLogin} 
    onClose={() => setCurrentView('home')} // При закрытии возвращаем на главную страницу
     />
    )}
      
      {currentView === 'profile' && <Profile user={currentUser} token={authToken} onLogout={handleLogout} />}

      {currentView === 'home' && (
        <>
          <header style={{ padding: '60px 20px 40px 20px', textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 15px 0', fontSize: '54px', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', color: '#fff', textShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}>
              Выбери свое <span style={{ color: '#00e5ff' }}>время</span>
            </h1>
          </header>

          <main style={{ padding: '0 30px', maxWidth: '1200px', margin: '0 auto', flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
            
            {/* ВЫПАДАЮЩИЙ КАЛЕНДАРЬ */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', position: 'relative', zIndex: 50 }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  style={{ width: '100%', padding: '16px 24px', borderRadius: '30px', backgroundColor: 'rgba(18, 18, 18, 0.85)', border: isCalendarOpen ? '1px solid #00e5ff' : '1px solid #333', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', transition: 'all 0.3s', boxShadow: isCalendarOpen ? '0 0 20px rgba(0, 229, 255, 0.2)' : '0 8px 16px rgba(0,0,0,0.2)' }}
                >
                  <span style={{ textTransform: 'capitalize' }}>📅 {selectedDayObj?.displayFull}</span>
                  <span style={{ transform: isCalendarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: '#00e5ff' }}>▼</span>
                </button>

                {isCalendarOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '10px', backgroundColor: '#121212', border: '1px solid #333', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.5)', zIndex: 100, maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {availableDays.map((day) => {
                      const isSelected = day.dateStr === selectedDate;
                      return (
                        <button
                          key={day.dateStr}
                          onClick={() => { setSelectedDate(day.dateStr); setIsCalendarOpen(false); }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = isSelected ? 'rgba(0, 229, 255, 0.05)' : 'transparent'}
                          style={{ width: '100%', padding: '14px 24px', border: 'none', backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.05)' : 'transparent', color: isSelected ? '#00e5ff' : '#aaa', textAlign: 'left', fontSize: '15px', cursor: 'pointer', borderBottom: '1px solid #222', transition: 'all 0.2s', fontWeight: isSelected ? 'bold' : 'normal', textTransform: 'capitalize' }}
                        >
                          {day.displayFull}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <input className="search-input" type="text" placeholder="🔍 Найти зал или инструмент..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '16px 24px', borderRadius: '30px', border: '1px solid #333', width: '100%', maxWidth: '600px', outline: 'none', backgroundColor: '#121212', color: '#fff', fontSize: '16px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '50px' }}>
              {CATEGORIES.map(category => (
                <button key={category} onClick={() => setActiveCategory(category)} style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeCategory === category ? '#00e5ff' : 'transparent', color: activeCategory === category ? '#000' : '#888', border: activeCategory === category ? '1px solid #00e5ff' : '1px solid #333' }}>{category}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', paddingBottom: '80px' }}>
              {filteredRooms.map(room => (
                <RoomCard key={room.id} room={room} onToggleSlot={handleSlotClick} onOpenDetails={(r) => { setSelectedRoom(r); setIsDetailsModalOpen(true); }} />
              ))}
            </div>
          </main>

          <footer style={{ backgroundColor: '#0a0a0a', padding: '40px 20px', borderTop: '1px solid #222', textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>РепБаза <span style={{ color: '#00e5ff' }}>Спектр</span></div>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>г. Москва, ул. Музыкальная, д. 12</p>
            <div style={{ color: '#444', fontSize: '12px' }}>© {new Date().getFullYear()} Все права защищены.</div>
          </footer>
        </>
      )}

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onConfirm={handleConfirmBooking} />
      <RoomDetailsModal isOpen={isDetailsModalOpen} room={selectedRoom} onClose={() => setIsDetailsModalOpen(false)} />
    </div>
  );
}

export default App;