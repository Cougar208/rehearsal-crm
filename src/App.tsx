import { useState, useEffect } from 'react';
import RoomCard from './components/RoomCard';
import AddRoomForm from './components/AddRoomForm';
import BookingModal from './components/BookingModal';
import EditRoomModal from './components/EditRoomModal';
import BookingsList from './components/BookingsList';
import type { Room, TimeSlot } from './types/Room';

const defaultSchedule: TimeSlot[] = [
  { id: "10:00", timeLabel: "10:00 - 12:00", isBooked: false },
  { id: "12:00", timeLabel: "12:00 - 14:00", isBooked: false },
  { id: "14:00", timeLabel: "14:00 - 16:00", isBooked: false },
  { id: "16:00", timeLabel: "16:00 - 18:00", isBooked: false },
  { id: "18:00", timeLabel: "18:00 - 20:00", isBooked: false },
  { id: "20:00", timeLabel: "20:00 - 22:00", isBooked: false },
];

const loadData = () => {
  const savedData = localStorage.getItem('crm_rooms');
  return savedData ? JSON.parse(savedData) : [
    { id: 1, name: "Красная комната", pricePerHour: 1000, area: 30, equipment: ["Барабаны Tama"], schedule: defaultSchedule.map(s => ({...s})) }
  ];
};

function App() {
  const [rooms, setRooms] = useState<Room[]>(loadData);
  const [searchQuery, setSearchQuery] = useState('');

  // Состояния для модалок
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<{ roomId: number, slotId: string } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  useEffect(() => {
    localStorage.setItem('crm_rooms', JSON.stringify(rooms));
  }, [rooms]);

  const handleAddRoom = (name: string, price: number, equipment: string[]) => {
    const newRoom: Room = {
      id: Date.now(), name, pricePerHour: price, area: 15, equipment,
      schedule: defaultSchedule.map(slot => ({ ...slot, isBooked: false }))
    };
    setRooms([...rooms, newRoom]);
  };

  const handleDeleteRoom = (id: number) => {
    if (window.confirm('Удалить этот зал?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  // ФУНКЦИЯ ОБНОВЛЕНИЯ ЗАЛА
  const handleUpdateRoom = (id: number, updatedData: Partial<Room>) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, ...updatedData } : room));
  };

  const handleSlotClick = (roomId: number, slotId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const slot = room?.schedule.find(s => s.id === slotId);
    if (!slot) return;

    if (!slot.isBooked) {
      setActiveBooking({ roomId, slotId });
      setIsBookingModalOpen(true);
    } else {
      setRooms(rooms.map(r => r.id === roomId ? {
        ...r, schedule: r.schedule.map(s => s.id === slotId ? { ...s, isBooked: false, clientName: undefined } : s)
      } : r));
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    room.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>CRM Репетиционной Базы</h1>

      {/* Дашборд и Список броней */}
      <div style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
        <BookingsList rooms={rooms} />
        <AddRoomForm onAddRoom={handleAddRoom} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <input 
          type="text" placeholder="Поиск по залам..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '30px', border: '1px solid #ccd0d5', width: '400px', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
        {filteredRooms.map(room => (
          <RoomCard 
            key={room.id} room={room} 
            onToggleSlot={handleSlotClick} 
            onDelete={handleDeleteRoom}
            onEdit={(r) => { setRoomToEdit(r); setIsEditModalOpen(true); }} 
          />
        ))}
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={(name) => {
          if (activeBooking) {
            setRooms(rooms.map(r => r.id === activeBooking.roomId ? {
              ...r, schedule: r.schedule.map(s => s.id === activeBooking.slotId ? { ...s, isBooked: true, clientName: name } : s)
            } : r));
          }
          setIsBookingModalOpen(false);
        }}
      />

      <EditRoomModal 
        isOpen={isEditModalOpen}
        room={roomToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateRoom}
      />
    </div>
  );
}

export default App;