import { useState } from 'react';
import api from '../services/api';

export default function CreateProject({ onProjectCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [stack, setStack] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('cover_image_url', image); 
    
    const stackArray = stack.split(',').map(s => s.trim()).filter(s => s !== '');
    stackArray.forEach(tech => formData.append('stack[]', tech));

    try {

      await api.post('/api/panel/projects', formData);

      alert('Projeto criado com sucesso!');
      setName(''); setDescription(''); setStack(''); setImage(null);
      onProjectCreated(); 
    } catch (error) {
      console.error("Erro ao criar projeto:", error.response?.data);
      // Se o erro persistir, o console vai mostrar os detalhes
      alert('Erro de autenticação ou sessão expirada. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Novo Projeto</h3>
      <input type="text" placeholder="Nome do Projeto" value={name} onChange={e => setName(e.target.value)} required />
      <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
      
      <div style={{ margin: '10px 0' }}>
        <label>Capa do Projeto: </label>
        <input type="file" onChange={e => setImage(e.target.files[0])} required />
      </div>

      <input type="text" placeholder="Tecnologias (ex: React, Laravel, Tailwind)" value={stack} onChange={e => setStack(e.target.value)} />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando para o Cloudinary...' : 'Salvar Projeto'}
      </button>
    </form>
  );
}