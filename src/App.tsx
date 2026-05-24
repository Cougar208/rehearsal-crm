import { useState, useEffect } from 'react';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import RoomDetailsModal from './components/RoomDetailsModal';
import MyBookingsModal from './components/MyBookingsModal';

import type { Room, TimeSlot } from './types/Room';

const defaultSchedule: TimeSlot[] = [
  { id: "12:00", timeLabel: "12:00 - 15:00", isBooked: false },
  { id: "15:00", timeLabel: "15:00 - 18:00", isBooked: false },
  { id: "18:00", timeLabel: "18:00 - 21:00", isBooked: false },
  { id: "21:00", timeLabel: "21:00 - 00:00", isBooked: false },
];

const catalogRooms: Room[] = [
  { id: 1, name: "Красный зал «Марс»", pricePerHour: 1200, area: 30, equipment: ["Барабаны Pearl", "Стек Marshall", "Микрофоны Shure"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80", description: "Агрессивный дизайн и плотный звук. Этот зал обшит специальными звукопоглощающими панелями красного цвета. Идеален для тяжелой музыки и рока." },
  { id: 2, name: "Оранжевая студия «Закат»", pricePerHour: 1000, area: 25, equipment: ["Барабаны Tama", "Комбик Orange", "Синтезатор Korg"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1460036521480-c116bb1c2c36?auto=format&fit=crop&w=800&q=80", description: "Теплая ламповая атмосфера. Зал с мягким светом и отличным винтажным бэклайном. Подходит для инди, джаза и акустики." },
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

const CATEGORIES = ['Все', 'Премиум', 'Барабаны', 'Клавиши', 'Бюджетно'];

function App() {
  // Календарь
  const availableDays = generateNextDays();
  const [selectedDate, setSelectedDate] = useState(availableDays[0].dateStr);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Состояние занятых слотов на выбранную дату (синхронизируется с Бэкендом)
  const [bookedSlots, setBookedSlots] = useState<Record<string, boolean>>({});

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');

  // Модальные окна
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<{ roomId: number, slotId: string } | null>(null);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);


  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`http://91.108.243.250/api/v1/syncslots?date=${selectedDate}`);
        if (!response.ok) throw new Error('Ошибка при синхронизации слотов');
        const data = await response.json(); 
        
        const newBookedState: Record<string, boolean> = {};
  
        data.forEach((booking: any) => {
          newBookedState[`${selectedDate}_${booking.roomId}_${booking.slotId}`] = true;
        });
        setBookedSlots(newBookedState);
      } catch (error) {
        console.error("Не удалось синхронизировать слоты с сервером:", error);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  // Функции бронирования
  const handleSlotClick = (roomId: number, slotId: string) => {
    setActiveBooking({ roomId, slotId });
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (clientName: string, phone: string) => {
    if (!activeBooking) return;
    const { roomId, slotId } = activeBooking;
    const bookingKey = `${selectedDate}_${roomId}_${slotId}`;

    const payload = {
      date: selectedDate,
      roomId: roomId,
      slotId: slotId,
      clientName: clientName,
      phone: phone
    };

    try {
   
      const response = await fetch('http://91.108.243.250/api/v1/makebooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Сервер отклонил бронирование');
      }

      
      setBookedSlots(prev => ({ ...prev, [bookingKey]: true }));

      setIsBookingModalOpen(false);
      setActiveBooking(null);
      alert(`Супер! Зал успешно забронирован на ${selectedDate}. Ждем вас!`);
    } catch (error) {
      console.error("Ошибка при отправке брони:", error);
      alert("Произошла ошибка при оформлении бронирования. Пожалуйста, попробуйте позже.");
    }
  };

  // Сборка карточек с учетом занятых слотов
  const currentRooms = catalogRooms.map(room => {
    return {
      ...room,
      schedule: room.schedule.map(slot => {
        const key = `${selectedDate}_${room.id}_${slot.id}`;
        return {
          ...slot,
          isBooked: !!bookedSlots[key]
        };
      })
    };
  });

  // Применение фильтров
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
      
      {/* ПАНЕЛЬ НАВИГАЦИИ */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>
          <span style={{ color: '#fff' }}>РепБаза</span> <span style={{ color: '#00e5ff' }}>Спектр</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          
          <button 
            onClick={() => setIsMyBookingsOpen(true)}
            style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#fff', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#00e5ff'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
          >
            🔍 Мои брони
          </button>

          <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Правила</a>
          <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Контакты</a>
        </div>
      </nav>

      {/* ШАПКА С ПРЕИМУЩЕСТВАМИ */}
      <header style={{ padding: '60px 20px 40px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '54px', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', color: '#fff', textShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}>
          Найди свой <span style={{ color: '#00e5ff' }}>звук</span>
        </h1>
        <p style={{ margin: '0 auto 40px auto', fontSize: '20px', color: '#aaa', maxWidth: '600px', lineHeight: '1.5' }}>
          7 unique залов, премиальное оборудование и идеальная акустика. Бронируй время онлайн за 1 минуту.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { title: "Топ оборудование", desc: "Marshall, DW, Shure" },
            { title: "Бесплатная парковка", desc: "Всегда есть места" },
            { title: "Зона отдыха", desc: "Кофе и PS5" },
            { title: "Работаем 24/7", desc: "Играй ночью" }
          ].map((feature, idx) => (
            <div key={idx} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', width: '200px' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#fff' }}>{feature.title}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </header>

      <main style={{ padding: '0 30px', maxWidth: '1200px', margin: '0 auto', flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
        
        {/* КАЛЕНДАРЬ */}
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

        {/* ПОИСК И ФИЛЬТРЫ */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <input className="search-input" type="text" placeholder="🔍 Найти зал или инструмент..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '16px 24px', borderRadius: '30px', border: '1px solid #333', width: '100%', maxWidth: '600px', outline: 'none', backgroundColor: '#121212', color: '#fff', fontSize: '16px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '50px' }}>
          {CATEGORIES.map(category => (
            <button key={category} onClick={() => setActiveCategory(category)} style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeCategory === category ? '#00e5ff' : 'transparent', color: activeCategory === category ? '#000' : '#888', border: activeCategory === category ? '1px solid #00e5ff' : '1px solid #333' }}>{category}</button>
          ))}
        </div>

        {/* СЕТКА ЗАЛОВ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', paddingBottom: '80px' }}>
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} onToggleSlot={handleSlotClick} onOpenDetails={(r) => { setSelectedRoom(r); setIsDetailsModalOpen(true); }} />
          ))}
        </div>
      </main>

      {/* ПОДВАЛ */}
      <footer style={{ backgroundColor: '#0a0a0a', padding: '40px 20px', borderTop: '1px solid #222', textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>РепБаза <span style={{ color: '#00e5ff' }}>Спектр</span></div>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>г. Москва, ул. Музыкальная, д. 12</p>
        <div style={{ color: '#444', fontSize: '12px' }}>© {new Date().getFullYear()} Все права защищены.</div>
      </footer>

      {/* МОДАЛЬНЫЕ ОКНА */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onConfirm={handleConfirmBooking} />
      <RoomDetailsModal isOpen={isDetailsModalOpen} room={selectedRoom} onClose={() => setIsDetailsModalOpen(false)} />
      <MyBookingsModal isOpen={isMyBookingsOpen} onClose={() => setIsMyBookingsOpen(false)} />
    </div>
  );
}

export default App;