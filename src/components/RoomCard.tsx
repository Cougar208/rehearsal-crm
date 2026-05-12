import type { Room } from '../types/Room';

interface RoomCardProps {
  room: Room;
  onToggleSlot: (roomId: number, slotId: string) => void;
}

export const RoomCard = ({ room, onToggleSlot }: RoomCardProps) => {
  return (
    <div 
      className="room-card"
      style={{
        borderRadius: '24px', 
        padding: '0', 
        backgroundColor: '#121212', // Темно-серый фон карточки
        width: '100%',
        boxSizing: 'border-box', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden', 
        border: '1px solid #2a2a2a' // Тонкая граница
      }}
    >
      
      {/* Шапка с градиентом в стиле Cyberpunk */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', 
        padding: '30px 24px', 
        color: 'white',
        position: 'relative'
      }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '0.5px' }}>{room.name}</h3>
        <p style={{ margin: '8px 0 0 0', color: '#00e5ff', fontSize: '18px', fontWeight: '700' }}>
          {room.pricePerHour} ₽ / час
        </p>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '15px', color: '#b3b3b3', lineHeight: '1.6', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '12px', border: '1px solid #222' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '4px' }}>
            Оборудование:
          </span>
          {room.equipment.join(' • ') || 'Базовый набор'}
        </div>

        <div>
          <p style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px', color: '#e0e0e0' }}>
            Свободное время на сегодня:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {room.schedule.map(slot => (
              <button
                key={slot.id}
                className="time-slot"
                onClick={() => !slot.isBooked && onToggleSlot(room.id, slot.id)}
                disabled={slot.isBooked}
                style={{
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: slot.isBooked ? '1px solid #222' : '1px solid rgba(0, 229, 255, 0.3)', 
                  fontSize: '14px', 
                  fontWeight: '700',
                  cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                  // Логика цветов: Свободно - неоновый синий, Занято - почти черный
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