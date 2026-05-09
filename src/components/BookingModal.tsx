import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean; // Открыто ли окно сейчас?
  onClose: () => void; // Функция закрытия окна (если передумали)
  onConfirm: (clientName: string) => void; // Функция подтверждения бронирования
}

export const BookingModal = ({ isOpen, onClose, onConfirm }: BookingModalProps) => {
  const [clientName, setClientName] = useState('');

  // Если окно закрыто, мы вообще ничего не рендерим (возвращаем null)
  if (!isOpen) return null;

  const handleConfirm = () => {
    // Передаем имя наверх и очищаем поле для следующего раза
    onConfirm(clientName);
    setClientName('');
  };

  const handleCancel = () => {
    // Просто закрываем и очищаем поле
    onClose();
    setClientName('');
  };

  return (
    // Темный полупрозрачный фон на весь экран
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000 // Делаем так, чтобы окно было поверх всех остальных элементов
    }}>
      {/* Сама белая карточка модального окна */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '16px',
        width: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#1c1e21', textAlign: 'center' }}>Подтверждение брони</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', color: '#455a64', fontWeight: 'bold' }}>
            Имя клиента или название группы:
          </label>
          <input 
            type="text" 
            placeholder="Например: Группа 'Метеор'"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            // Позволяем нажать Enter для подтверждения
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
            style={{
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid #ccd0d5',
              outline: 'none',
              fontSize: '16px'
            }}
            autoFocus // Курсор сразу встанет в это поле при открытии окна
          />
        </div>

        {/* Кнопки управления */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f2f5',
              color: '#455a64',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px'
            }}
          >
            Отмена
          </button>
          <button 
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1877f2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px'
            }}
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;