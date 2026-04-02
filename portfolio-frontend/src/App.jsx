import { useState, useEffect } from "react";
import api from "./services/api";
import Login from "./components/Login";
import CreateProject from "./components/CreateProject";
import EditableConfig from "./components/EditableConfig";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    }
  };

  const loadConfigs = async () => {
    try {
      const res = await api.get("/api/configs");
      if (Object.keys(res.data).length > 0) {
        setConfigs(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    }
  };

  const [configs, setConfigs] = useState({
    hero_title: "Carregando...",
    bio_text: "",
    linkedin_url: "",
  });

  const updateLocalConfig = (key, value) => {
    setConfigs((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadProjects();
    loadConfigs();
  }, []);

  return (
    <div className="bg-surface-base text-content-primary min-h-screen px-6 md:px-[10%] selection:bg-primary/30 overflow-x-hidden">
      <nav className="flex justify-between items-center py-6 md:py-8 border-b border-primary/40">
        <img
          src="https://res.cloudinary.com/dbr43jqca/image/upload/v1775090801/icon_dikmyu.png"
          className="w-8 md:w-10 h-auto"
          alt="Logo"
        />
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em]">
          <span className="text-primary-light relative font-bold cursor-pointer">
            1. home
          </span>
          <span className="text-content-secondary hover:text-primary transition-colors cursor-pointer">
            2. sobre
          </span>
          <span className="text-content-secondary hover:text-primary transition-colors cursor-pointer">
            3. experiência
          </span>
          <span className="text-content-secondary hover:text-primary transition-colors cursor-pointer">
            4. projetos
          </span>
        </div>
      </nav>

      <section className="relative flex items-center min-h-[70vh] md:min-h-[80vh] py-10 md:py-0">
        <div className="z-10 w-full max-w-2xl">
          <p className="text-primary text-base md:text-xl mb-3 md:mb-4 font-medium">
            Olá, mundo! Eu sou a
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-primary uppercase leading-[1.1] md:leading-[0.9] tracking-tighter">
            <EditableConfig
              configKey="hero_title"
              value={configs.hero_title}
              isLogged={isLogged}
              onUpdate={updateLocalConfig}
            />
          </h1>

          <p className="mt-4 md:mt-8 text-content-secondary text-sm md:text-lg leading-relaxed max-w-lg">
            <EditableConfig
              configKey="bio_text"
              value={configs.bio_text}
              isLogged={isLogged}
              onUpdate={updateLocalConfig}
            />
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href={configs.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 md:mt-10 px-8 py-3 border border-primary text-primary hover:bg-primary/10 transition-all uppercase tracking-widest text-[10px] font-bold text-center"
            >
              BAIXAR CV
            </a>

            {isLogged && (
              <div className="mt-2 md:mt-10 text-[10px] opacity-50">
                <EditableConfig
                  configKey="cv_url"
                  value={configs.cv_url}
                  isLogged={isLogged}
                  onUpdate={updateLocalConfig}
                />
              </div>
            )}
          </div>
        </div>

        <img
          src="https://res.cloudinary.com/dbr43jqca/image/upload/v1775090801/icon_dikmyu.png"
          className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-[600px] opacity-[0.04] pointer-events-none select-none"
          alt="Background Icon"
        />
      </section>
    </div>
  );
}

export default App;
