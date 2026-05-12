import { useState, useEffect } from 'react';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import RoomDetailsModal from './components/RoomDetailsModal';
import type { Room, TimeSlot } from './types/Room';

const defaultSchedule: TimeSlot[] = [
  { id: "12:00", timeLabel: "12:00 - 15:00", isBooked: false },
  { id: "15:00", timeLabel: "15:00 - 18:00", isBooked: false },
  { id: "18:00", timeLabel: "18:00 - 21:00", isBooked: false },
  { id: "21:00", timeLabel: "21:00 - 00:00", isBooked: false },
];

const initialRooms: Room[] = [
  { 
    id: 1, name: "Красный зал «Марс»", pricePerHour: 1200, area: 30, equipment: ["Барабаны Pearl", "Стек Marshall", "Микрофоны Shure"], schedule: defaultSchedule.map(s => ({...s})),
    imageUrl: "https://www.red-gates.ru/backdoor/image/room/REDbig4.jpg",
    description: "Агрессивный дизайн и плотный звук. Этот зал обшит специальными звукопоглощающими панелями красного цвета. Идеален для тяжелой музыки и рока.",
    gallery: ["https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=200&q=80", "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=200&q=80"]
  },
  { 
    id: 2, name: "Оранжевая студия «Закат»", pricePerHour: 1000, area: 25, equipment: ["Барабаны Tama", "Комбик Orange", "Синтезатор Korg"], schedule: defaultSchedule.map(s => ({...s})),
    imageUrl: "https://images.unsplash.com/photo-1460036521480-c116bb1c2c36?auto=format&fit=crop&w=800&q=80",
    description: "Теплая ламповая атмосфера. Зал с мягким светом и отличным винтажным бэклайном. Подходит для инди, джаза и акустики."
  },
  { id: 3, name: "Желтая комната «Вольт»", pricePerHour: 800, area: 20, equipment: ["Электронная установка Roland", "Бас-комбо Markbass"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Зеленый цех «Матрица»", pricePerHour: 900, area: 28, equipment: ["Барабаны Mapex", "Синтезаторы Moog", "Пульт Yamaha"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1559424452-eeb3a13fe2ae?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Голубой лаунж «Океан»", pricePerHour: 1400, area: 35, equipment: ["Акустическое пианино", "Микрофоны Neumann", "Студийные мониторы"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "Синий зал «Неон»", pricePerHour: 1500, area: 40, equipment: ["Барабаны DW", "Гитарные процессоры Kemper", "Свет DMX"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?auto=format&fit=crop&w=800&q=80" },
  { id: 7, name: "Фиолетовый Premium «Космос»", pricePerHour: 2000, area: 50, equipment: ["Рояль", "Барабаны Sonor SQ2", "Топовый бэклайн", "Зона отдыха"], schedule: defaultSchedule.map(s => ({...s})), imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80" }
];

const loadData = () => {
  const savedData = localStorage.getItem('client_booking_rooms_details');
  return savedData ? JSON.parse(savedData) : initialRooms;
};

const CATEGORIES = ['Все', 'Премиум', 'Барабаны', 'Клавиши', 'Бюджетно'];

function App() {
  const [rooms, setRooms] = useState<Room[]>(loadData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<{ roomId: number, slotId: string } | null>(null);

  // СОСТОЯНИЯ ДЛЯ ОКНА ДЕТАЛЕЙ ЗАЛА
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    localStorage.setItem('client_booking_rooms_details', JSON.stringify(rooms));
  }, [rooms]);

  const handleSlotClick = (roomId: number, slotId: string) => {
    setActiveBooking({ roomId, slotId });
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (clientName: string, phone: string) => {
    if (!activeBooking) return;
    const { roomId, slotId } = activeBooking;
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, schedule: room.schedule.map(slot => slot.id === slotId ? { ...slot, isBooked: true, clientName: `${clientName} (${phone})` } : slot) };
      }
      return room;
    });
    setRooms(updatedRooms);
    setIsBookingModalOpen(false);
    setActiveBooking(null);
    alert(`Спасибо, ${clientName}! Зал успешно забронирован.`);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()));
    let matchesCategory = true;
    if (activeCategory === 'Премиум') matchesCategory = room.pricePerHour >= 1400;
    if (activeCategory === 'Барабаны') matchesCategory = room.equipment.some(eq => eq.toLowerCase().includes('барабан'));
    if (activeCategory === 'Клавиши') matchesCategory = room.equipment.some(eq => eq.toLowerCase().includes('пианино') || eq.toLowerCase().includes('рояль') || eq.toLowerCase().includes('синтезатор'));
    if (activeCategory === 'Бюджетно') matchesCategory = room.pricePerHour <= 900;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>
          <span style={{ color: '#fff' }}>РепБаза</span> <span style={{ color: '#00e5ff' }}>Спектр</span>
        </div>
      </nav>

      <header style={{ padding: '80px 20px 60px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '64px', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', color: '#fff', textShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}>Найди свой <span style={{ color: '#00e5ff' }}>звук</span></h1>
      </header>

      <main style={{ padding: '0 30px', maxWidth: '1200px', margin: '0 auto', flexGrow: 1, width: '100%', boxSizing: 'border-box' }}>
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
            <RoomCard 
              key={room.id} 
              room={room} 
              onToggleSlot={handleSlotClick} 
              // ПЕРЕДАЕМ ФУНКЦИЮ ОТКРЫТИЯ ДЕТАЛЕЙ
              onOpenDetails={(r) => {
                setSelectedRoom(r);
                setIsDetailsModalOpen(true);
              }} 
            />
          ))}
        </div>
      </main>

      {/* ОКНО БРОНИРОВАНИЯ */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onConfirm={handleConfirmBooking} />
      
      {/* НОВОЕ ОКНО ДЕТАЛЕЙ */}
      <RoomDetailsModal isOpen={isDetailsModalOpen} room={selectedRoom} onClose={() => setIsDetailsModalOpen(false)} />
    </div>
  );
}

export default App;