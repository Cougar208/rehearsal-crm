import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clientName: string, phone: string) => void;
}

export const BookingModal = ({ isOpen, onClose, onConfirm }: BookingModalProps) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!clientName || !phone) return;
    onConfirm(clientName, phone);
    setClientName('');
    setPhone('');
  };

  const handleCancel = () => {
    onClose();
    setClientName('');
    setPhone('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      backdropFilter: 'blur(8px)' // Сильное размытие заднего фона
    }}>
      <div style={{
        backgroundColor: '#121212', padding: '40px', borderRadius: '24px',
        width: '400px', boxShadow: '0 0 40px rgba(138, 43, 226, 0.2)',
        display: 'flex', flexDirection: 'column', gap: '20px',
        border: '1px solid #2a2a2a'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#ffffff' }}>Оформление брони</h2>
          <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Оставьте данные, и мы закрепим зал за вами</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#aaa', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Ваше имя или название группы *</label>
            <input 
              type="text" placeholder="Иван Иванов" value={clientName} onChange={(e) => setClientName(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }}
              autoFocus
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#aaa', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Номер телефона *</label>
            <input 
              type="tel" placeholder="+7 (999) 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={handleConfirm}
            style={{ padding: '14px', background: 'linear-gradient(90deg, #8a2be2 0%, #00e5ff 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            Подтвердить бронь
          </button>
          <button 
            onClick={handleCancel}
            style={{ padding: '14px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;