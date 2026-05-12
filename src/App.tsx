import { useState, useEffect } from 'react';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import type { Room, TimeSlot } from './types/Room';

const defaultSchedule: TimeSlot[] = [
  { id: "10:00", timeLabel: "10:00 - 12:00", isBooked: false },
  { id: "12:00", timeLabel: "12:00 - 14:00", isBooked: false },
  { id: "14:00", timeLabel: "14:00 - 16:00", isBooked: false },
  { id: "16:00", timeLabel: "16:00 - 18:00", isBooked: false },
  { id: "18:00", timeLabel: "18:00 - 20:00", isBooked: false },
  { id: "20:00", timeLabel: "20:00 - 22:00", isBooked: false },
];

// Убрали все хардкодные бронирования. Теперь при map() мы просто копируем чистый шаблон.
const initialRooms: Room[] = [
  { id: 1, name: "Premium Зал 'Неон'", pricePerHour: 1500, area: 40, equipment: ["Барабаны DW", "Усилители Orange", "Микрофоны Shure SM58"], schedule: defaultSchedule.map(s => ({...s})) },
  { id: 2, name: "Акустическая студия", pricePerHour: 800, area: 20, equipment: ["Пианино Yamaha", "Комбоусилитель Fender", "Стойки"], schedule: defaultSchedule.map(s => ({...s})) },
  { id: 3, name: "Базовый цех", pricePerHour: 600, area: 25, equipment: ["Барабаны Tama", "Бас-комбик Ampeg"], schedule: defaultSchedule.map(s => ({...s})) },
];

const loadData = () => {
  // ИЗМЕНЕНИЕ КЛЮЧА: Чтобы сбросить старую память браузера с занятыми часами
  const savedData = localStorage.getItem('client_booking_rooms_clean');
  return savedData ? JSON.parse(savedData) : initialRooms;
};

function App() {
  const [rooms, setRooms] = useState<Room[]>(loadData);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<{ roomId: number, slotId: string } | null>(null);

  useEffect(() => {
    // Сохраняем по новому чистому ключу
    localStorage.setItem('client_booking_rooms_clean', JSON.stringify(rooms));
  }, [rooms]);

  const handleSlotClick = (roomId: number, slotId: string) => {
    setActiveBooking({ roomId, slotId });
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (clientName: string, phone: string) => {
    if (!activeBooking) return;
    const { roomId, slotId } = activeBooking;

    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        const updatedSchedule = room.schedule.map(slot => {
          if (slot.id === slotId) {
            return { ...slot, isBooked: true, clientName: `${clientName} (${phone})` };
          }
          return slot;
        });
        return { ...room, schedule: updatedSchedule };
      }
      return room;
    });

    setRooms(updatedRooms);
    setIsModalOpen(false);
    setActiveBooking(null);
    
    alert(`Спасибо, ${clientName}! Зал успешно забронирован.`);
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    room.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      
      {/* Темный HEADER */}
      <header style={{ 
        background: 'linear-gradient(180deg, #0a0a0a 0%, rgba(10,10,10,0) 100%)', 
        padding: '60px 20px 40px 20px', 
        textAlign: 'center', 
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '56px', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', color: '#fff', textShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}>
          РепБаза <span style={{ color: '#00e5ff' }}>ЗВУК</span>
        </h1>
        <p style={{ margin: 0, fontSize: '18px', color: '#888', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Бронируй лучшие репетиционные залы онлайн. Выбирай время, забирай звук.
        </p>
      </header>

      <div style={{ padding: '0 30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Поиск */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
          <input 
            className="search-input"
            type="text" placeholder="🔍 Найти по залу или инструменту..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: '16px 24px', borderRadius: '30px', border: '1px solid #333', 
              width: '100%', maxWidth: '600px', outline: 'none', 
              backgroundColor: '#121212', color: '#fff', fontSize: '16px' 
            }}
          />
        </div>

        {/* Сетка залов */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', paddingBottom: '80px' }}>
          {filteredRooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onToggleSlot={handleSlotClick} 
            />
          ))}
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}

export default App;