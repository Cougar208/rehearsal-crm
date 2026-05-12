import type { Room } from '../types/Room';

interface RoomDetailsModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RoomDetailsModal = ({ room, isOpen, onClose }: RoomDetailsModalProps) => {
  if (!isOpen || !room) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 2000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: '#121212', borderRadius: '24px', width: '900px', maxWidth: '95%',
        maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333',
        display: 'flex', flexDirection: 'column', position: 'relative',
        boxShadow: '0 25px 50px rgba(0,229,255,0.1)'
      }}>
        
        {/* Кнопка закрытия (Крестик) */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)',
          border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer',
          width: '40px', height: '40px', borderRadius: '50%', zIndex: 10
        }}>✕</button>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Левая часть: Галерея */}
          <div style={{ flex: '1 1 400px', padding: '24px' }}>
            <img src={room.imageUrl} alt={room.name} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px', marginBottom: '15px' }} />
            {room.gallery && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {room.gallery.map((img, idx) => (
                  <img key={idx} src={img} alt={`Gallery ${idx}`} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
                ))}
              </div>
            )}
          </div>

          {/* Правая часть: Информация */}
          <div style={{ flex: '1 1 400px', padding: '24px 24px 24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#fff' }}>{room.name}</h2>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '18px' }}>
                {room.pricePerHour} ₽ / час
              </div>
            </div>

            <div style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6' }}>
              {room.description || "Уютный зал с отличной акустикой и профессиональным оборудованием. Идеально подойдет для репетиций групп и индивидуальных занятий."}
            </div>

            <div style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '12px', border: '1px solid #222' }}>
              <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Характеристики:</div>
              <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>📏 <strong>Площадь:</strong> {room.area} м²</div>
              <div style={{ color: '#fff', fontSize: '14px' }}>🎸 <strong>Оборудование:</strong> {room.equipment.join(' • ')}</div>
            </div>
            
            {/* Кнопка закрытия внизу */}
            <button onClick={onClose} style={{ marginTop: 'auto', padding: '14px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              Понятно, к выбору времени
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;