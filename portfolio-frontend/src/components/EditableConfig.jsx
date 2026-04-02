import { useState } from 'react';
import api from '../services/api';

export default function EditableConfig({ configKey, value, onUpdate, isLogged }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/api/panel/configs', {
        configs: { [configKey]: tempValue }
      });

      onUpdate(configKey, tempValue); // atualiza o estado no App.jsx
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alteração.");
    } finally {
      setLoading(false);
    }
  };

  // se não estiver logada, renderiza apenas o texto puro
  if (!isLogged) return <span>{value}</span>;

  // se estiver logada e em modo de edição
  if (isEditing) {
    return (
      <div style={{ display: 'inline-flex', gap: '5px' }}>
        <input 
          value={tempValue} 
          onChange={(e) => setTempValue(e.target.value)}
          style={{ fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit' }}
        />
        <button onClick={handleSave} disabled={loading}>{loading ? '...' : '✅'}</button>
        <button onClick={() => setIsEditing(false)}>❌</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <span>{value}</span>
      <button 
        onClick={() => setIsEditing(true)} 
        style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1rem' }}
      >
        ✏️
      </button>
    </div>
  );
}