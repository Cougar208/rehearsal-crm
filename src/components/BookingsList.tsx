import type { Room } from '../types/Room';

interface BookingsListProps {
  rooms: Room[];
}

export const BookingsList = ({ rooms }: BookingsListProps) => {
  // 1. Собираем все занятые слоты из всех комнат в один список
  const allBookings = rooms.flatMap(room => 
    room.schedule
      .filter(slot => slot.isBooked) // Берем только занятые часы
      .map(slot => ({
        // Создаем новый удобный объект для каждого бронирования
        id: `${room.id}-${slot.id}`, // Уникальный ключ (например: "1-14:00")
        roomName: room.name,
        time: slot.timeLabel,
        client: slot.clientName
      }))
  );

  // 2. Если броней на сегодня нет, мы вообще не показываем этот блок
  if (allBookings.length === 0) {
    return null;
  }

  // 3. Отрисовываем список
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '16px', 
      marginBottom: '40px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1c1e21', display: 'flex', alignItems: 'center', gap: '10px' }}>
        📋 Ближайшие клиенты
        <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '12px', fontSize: '14px' }}>
          {allBookings.length}
        </span>
      </h3>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {allBookings.map(booking => (
          <div key={booking.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #1877f2'
          }}>
            <div>
              <strong style={{ color: '#2c3e50', fontSize: '15px' }}>{booking.client}</strong>
              <span style={{ margin: '0 10px', color: '#b0bec5' }}>|</span>
              <span style={{ color: '#546e7a', fontSize: '14px' }}>{booking.roomName}</span>
            </div>
            <div style={{ fontWeight: 'bold', color: '#1976d2', backgroundColor: '#e3f2fd', padding: '6px 12px', borderRadius: '6px', fontSize: '14px' }}>
              {booking.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsList;