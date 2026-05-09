import { useState, useEffect } from 'react';
import type { Room } from '../types/Room';

interface EditRoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedData: Partial<Room>) => void;
}

export const EditRoomModal = ({ room, isOpen, onClose, onSave }: EditRoomModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [equipment, setEquipment] = useState('');

  // Когда открываем модалку для конкретной комнаты, предзаполняем поля её данными
  useEffect(() => {
    if (room) {
      setName(room.name);
      setPrice(room.pricePerHour.toString());
      setEquipment(room.equipment.join(', '));
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const handleSave = () => {
    const equipmentArray = equipment
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    onSave(room.id, {
      name,
      pricePerHour: Number(price),
      equipment: equipmentArray
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1100
    }}>
      <div style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '16px',
        width: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#1c1e21', textAlign: 'center' }}>Редактировать зал</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Название:</label>
          <input 
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccd0d5' }}
          />

          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Цена (руб/час):</label>
          <input 
            type="number" value={price} onChange={(e) => setPrice(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccd0d5' }}
          />

          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Оборудование (через запятую):</label>
          <textarea 
            value={equipment} onChange={(e) => setEquipment(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccd0d5', minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Отмена</button>
          <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#1877f2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;