import { useState, useEffect } from 'react';

interface ProfileProps {
  user: any;
  token: string;
  onLogout: () => void;
}

export const Profile = ({ user, token, onLogout }: ProfileProps) => {
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.photo || null);

  // РУЧКА 2: Получаем историю бронирований клиента
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        // Замени на реальный URL твоего API
        /*
        const response = await fetch('https://твой-бэкенд.com/api/users/me/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setMyBookings(data);
        */
        
        // Временные фейковые данные
        setMyBookings([
          { id: 1, date: '2026-05-20', roomName: 'Красный зал «Марс»', timeLabel: '18:00 - 21:00', price: 3600 },
          { id: 2, date: '2026-05-25', roomName: 'Синий зал «Неон»', timeLabel: '12:00 - 15:00', price: 4500 }
        ]);
      } catch (error) {
        console.error("Ошибка загрузки броней", error);
      }
    };
    fetchMyBookings();
  }, [token]);

  // РУЧКА 3: Отправка новой аватарки на сервер
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Показываем превью сразу
    const localUrl = URL.createObjectURL(file);
    setPhotoPreview(localUrl);

    // Отправляем файл на бэкенд
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      
      await fetch('https://91.108.243.250', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      alert("Фото успешно загружено в БД!");
    } catch (err) {
      alert("Ошибка при загрузке фото");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
      
      {/* Шапка профиля */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', backgroundColor: '#121212', padding: '30px', borderRadius: '24px', border: '1px solid #333' }}>
        
        {/* Загрузка фото */}
        <label style={{ cursor: 'pointer', position: 'relative' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#222', backgroundImage: `url(${photoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid #00e5ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!photoPreview && <span style={{ fontSize: '40px' }}>👤</span>}
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#00e5ff', color: '#000', padding: '6px', borderRadius: '50%', fontSize: '12px' }}>📷</div>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
        </label>

        <div style={{ flexGrow: 1 }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>{user.name}</h2>
          <p style={{ margin: 0, color: '#888' }}>{user.email}</p>
        </div>
        
        <button onClick={onLogout} style={{ padding: '12px 20px', backgroundColor: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
          Выйти
        </button>
      </div>

      {/* История бронирований */}
      <h3 style={{ marginTop: '40px', fontSize: '24px', color: '#00e5ff' }}>Мои репетиции</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {myBookings.length === 0 ? (
          <p style={{ color: '#666' }}>У вас пока нет бронирований.</p>
        ) : (
          myBookings.map(book => (
            <div key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121212', padding: '20px', borderRadius: '16px', border: '1px solid #222' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{book.roomName}</h4>
                <div style={{ color: '#aaa', fontSize: '14px' }}>📅 {book.date} | ⏰ {book.timeLabel}</div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00e5ff' }}>
                {book.price} ₽
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;