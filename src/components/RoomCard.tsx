import type { Room } from '../types/Room';

interface RoomCardProps {
  room: Room;
  onToggleSlot: (roomId: number, slotId: string) => void;
  onOpenDetails: (room: Room) => void; // НОВАЯ ФУНКЦИЯ
}

export const RoomCard = ({ room, onToggleSlot, onOpenDetails }: RoomCardProps) => {
  return (
    <div className="room-card" style={{
      borderRadius: '24px', padding: '0', backgroundColor: '#121212', width: '100%',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', border: '1px solid #2a2a2a'
    }}>
      
      {/* КЛИКАБЕЛЬНАЯ ШАПКА С КАРТИНКОЙ */}
      <div 
        onClick={() => onOpenDetails(room)} // Вызываем открытие окна при клике
        style={{ 
          height: '220px', cursor: 'pointer', // Меняем курсор на "руку"
          backgroundImage: room.imageUrl ? `linear-gradient(to bottom, rgba(18,18,18,0) 0%, #121212 100%), url('${room.imageUrl}')` : 'none',
          backgroundSize: 'cover', backgroundPosition: 'center', padding: '24px', 
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: 'white',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '26px', fontWeight: '900', letterSpacing: '0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          {room.name}
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#00e5ff', fontSize: '18px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
          {room.pricePerHour} ₽ / час
        </p>
      </div>

      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '14px', color: '#b3b3b3', lineHeight: '1.6', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '4px' }}>Оборудование:</span>
          {room.equipment.join(' • ') || 'Базовый набор'}
        </div>

        <div>
          <p style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px', color: '#e0e0e0' }}>Свободное время на сегодня:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {room.schedule.map(slot => (
              <button
                key={slot.id} className="time-slot"
                onClick={() => !slot.isBooked && onToggleSlot(room.id, slot.id)}
                disabled={slot.isBooked}
                style={{
                  padding: '14px', borderRadius: '12px', 
                  border: slot.isBooked ? '1px solid #222' : '1px solid rgba(0, 229, 255, 0.3)', 
                  fontSize: '14px', fontWeight: '700', cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                  backgroundColor: slot.isBooked ? '#0d0d0d' : 'rgba(0, 229, 255, 0.05)',
                  color: slot.isBooked ? '#4d4d4d' : '#00e5ff',
                }}
              >
                {slot.timeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;