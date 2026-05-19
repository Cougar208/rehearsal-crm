import { useState } from 'react';

interface AuthProps {
  onLoginSuccess: (userData: any, token: string) => void;
  onClose: () => void; // НОВОЕ СВОЙСТВО: функция закрытия
}

export const Auth = ({ onLoginSuccess, onClose }: AuthProps) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isLoginView 
      ? 'https://91.108.243.250' 
      : 'https://91.108.243.250';

    const payload = isLoginView 
      ? { email, password } 
      : { name, email, phone, password };

    try {
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Ошибка авторизации');
      const data = await response.json();
      onLoginSuccess(data.user, data.token);
      

      const fakeUser = { 
        id: `client_${Date.now()}`, // Генерируем уникальный ID для имитации БД
        name: isLoginView ? "Музыкант" : name, 
        email, 
        photo: null 
      };
      onLoginSuccess(fakeUser, "fake-jwt-token-123");

    } catch (error) {
      console.error(error);
      alert('Ошибка при отправке данных на сервер');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      backgroundColor: '#121212', 
      padding: '40px', 
      borderRadius: '24px', 
      border: '1px solid #333', 
      boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
      position: 'relative' // ВАЖНО: чтобы крестик позиционировался относительно карточки
    }}>
      
      {/* КНОПКА ЗАКРЫТИЯ (КРЕСТИК) */}
      <button 
        onClick={onClose} 
        style={{
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          background: 'transparent',
          border: 'none', 
          color: '#666', 
          fontSize: '20px', 
          cursor: 'pointer', 
          transition: 'color 0.2s',
          padding: '5px',
          lineHeight: '1'
        }}
        onMouseOver={e => e.currentTarget.style.color = '#fff'}
        onMouseOut={e => e.currentTarget.style.color = '#666'}
      >
        ✕
      </button>

      <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>
        {isLoginView ? 'Вход в аккаунт' : 'Регистрация'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLoginView && (
          <>
            <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none' }} />
            <input type="tel" placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} required style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none' }} />
          </>
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none' }} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none' }} />

        <button type="submit" style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#00e5ff', color: '#000', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
          {isLoginView ? 'Войти' : 'Создать аккаунт'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' }}>
        {isLoginView ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
        <span onClick={() => setIsLoginView(!isLoginView)} style={{ color: '#00e5ff', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoginView ? 'Зарегистрируйтесь' : 'Войдите'}
        </span>
      </div>
    </div>
  );
};

export default Auth;