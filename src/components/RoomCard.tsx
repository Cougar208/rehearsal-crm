import type { Room } from '../types/Room';

interface RoomCardProps {
  room: Room;
  onToggleSlot: (roomId: number, slotId: string) => void;
  onDelete: (id: number) => void;
  onEdit: (room: Room) => void; // Добавляем проп для редактирования
}

export const RoomCard = ({ room, onToggleSlot, onDelete, onEdit }: RoomCardProps) => {
  return (
    <div style={{
      borderRadius: '16px', padding: '24px', backgroundColor: '#ffffff',
      boxShadow: '0 10px 20px rgba(0,0,0,0.08)', width: '100%',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      gap: '15px', position: 'relative'
    }}>
      
      {/* Кнопки управления в углу */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => onEdit(room)}
          style={{ background: 'none', border: 'none', color: '#1877f2', fontSize: '18px', cursor: 'pointer' }}
          title="Редактировать"
        >
          ✏️
        </button>
        <button 
          onClick={() => onDelete(room.id)}
          style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
          title="Удалить"
        >
          ✕
        </button>
      </div>

      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', paddingRight: '40px' }}>
        <h3 style={{ margin: 0, color: '#2c3e50' }}>{room.name}</h3>
        <p style={{ margin: '5px 0', color: '#1976d2', fontWeight: 'bold' }}>{room.pricePerHour} ₽/час</p>
      </div>

      <div style={{ fontSize: '13px', color: '#607d8b' }}>
        <strong>Инструменты:</strong> {room.equipment.join(', ') || 'нет данных'}
      </div>

      <div style={{ marginTop: '10px' }}>
        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#455a64' }}>Расписание:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {room.schedule.map(slot => (
            <button
              key={slot.id}
              onClick={() => onToggleSlot(room.id, slot.id)}
              style={{
                padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                backgroundColor: slot.isBooked ? '#ffebee' : '#e8f5e9',
                color: slot.isBooked ? '#c62828' : '#2e7d32',
                borderLeft: `4px solid ${slot.isBooked ? '#ef5350' : '#66bb6a'}`
              }}
            >
              {slot.timeLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;