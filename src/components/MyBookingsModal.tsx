import { useState } from 'react';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingsModal = ({ isOpen, onClose }: MyBookingsModalProps) => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
  
      const response = await fetch(`http://91.108.243.250/api/v1/getbookingsbyphone?phone=${encodeURIComponent(phone)}`);
      
      if (!response.ok) {
        throw new Error('Ошибка сервера при получении бронирований');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить ваши бронирования. Проверьте подключение к сети.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(8px)' }}>
      <div style={{ backgroundColor: '#121212', borderRadius: '24px', width: '500px', maxWidth: '95%', padding: '40px', border: '1px solid #333', position: 'relative', boxShadow: '0 25px 50px rgba(0,229,255,0.1)' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer' }}>✕</button>

        <h2 style={{ textAlign: 'center', color: '#fff', margin: '0 0 20px 0' }}>Мои бронирования</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '14px' }}>Введите номер телефона, указанный при бронировании</p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input type="tel" placeholder="+7 (999) 000-00-00" value={phone} onChange={e => setPhone(e.target.value)} required style={{ flexGrow: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none' }} />
          <button type="submit" disabled={isLoading} style={{ padding: '0 24px', borderRadius: '12px', backgroundColor: '#00e5ff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            {isLoading ? 'Поиск...' : 'Найти'}
          </button>
        </form>

        {bookings !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666' }}>Бронирований не найдено</div>
            ) : (
              bookings.map((b, idx) => (
                <div key={idx} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '12px', border: '1px solid #222' }}>
                  <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px', fontSize: '16px' }}>{b.roomName || `Зал №${b.roomId}`}</div>
                  <div style={{ color: '#00e5ff', fontSize: '14px' }}>📅 {b.date} | ⏰ {b.timeLabel || b.slotId}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsModal;