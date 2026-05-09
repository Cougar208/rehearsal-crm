import { useState } from 'react';

interface AddRoomFormProps {
  onAddRoom: (name: string, price: number, equipment: string[]) => void;
}

export const AddRoomForm = ({ onAddRoom }: AddRoomFormProps) => {
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const handleSubmit = () => {
    if (newName === '' || newPrice === '') return;
    
    const equipmentArray = newEquipment
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    onAddRoom(newName, Number(newPrice), equipmentArray);
    
    setNewName('');
    setNewPrice('');
    setNewEquipment('');
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '24px', 
      borderRadius: '16px', 
      marginBottom: '40px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>+ Добавить новую комнату</h3>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <input 
          type="text" placeholder="Название зала" value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: '1', minWidth: '200px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccd0d5', outline: 'none', fontSize: '15px' }}
        />
        <input 
          type="number" placeholder="Цена (руб/час)" value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ flex: '0.5', minWidth: '130px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccd0d5', outline: 'none', fontSize: '15px' }}
        />
        <input 
          type="text" placeholder="Оборудование (через запятую)" value={newEquipment}
          onChange={(e) => setNewEquipment(e.target.value)}
          style={{ flex: '2', minWidth: '250px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccd0d5', outline: 'none', fontSize: '15px' }}
        />
        <button 
          onClick={handleSubmit} 
          style={{ 
            padding: '10px 24px', backgroundColor: '#1877f2', color: 'white', 
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap'
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
};

export default AddRoomForm;