import { useState, useEffect } from 'react';
import api from './services/api';
import Login from './components/Login';
import CreateProject from './components/CreateProject';

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false); 

  const loadProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Painel Administrativo</h1>

      {!isLogged ? (
        <Login onLoginSuccess={() => setIsLogged(true)} />
      ) : (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f0f4f8', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>✅ Logada como Administradora</span>
            <button onClick={() => setIsLogged(false)}>Sair</button>
          </div>

          <hr />

          {/* Se showForm for falso, mostra o botão. Se for verdadeiro, mostra o formulário */}
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)} 
              style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}
            >
              + Adicionar Novo Projeto
            </button>
          ) : (
            <div>
              <button onClick={() => setShowForm(false)} style={{ marginBottom: '10px' }}>
                Cancelar
              </button>
              <CreateProject onProjectCreated={() => {
                loadProjects();
                setShowForm(false); // Esconde o form depois de criar
              }} />
            </div>
          )}
        </div>
      )}

      <h2>Projetos Existentes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {projects.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            {p.cover_image_url && (
              <img src={p.cover_image_url} alt={p.name} style={{ width: '100%', borderRadius: '4px' }} />
            )}
            <h4>{p.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;