import { useState, useEffect } from "react";
import api from "./services/api";
import Login from "./components/Login";
import EditableConfig from "./components/EditableConfig";

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const [experiences, setExperiences] = useState([]);
  const [activeExp, setActiveExp] = useState(0);

  const [configs, setConfigs] = useState({
    hero_title: "",
    bio_text: "",
    bio: "",
    cv_url: "",
    photo_url: "",
    technologies: [],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-150px 0px -50% 0px", threshold: 0.1 },
    );

    document
      .querySelectorAll("section[id]")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const loadInitialData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/configs"),
        api.get("/about"),
        api.get("/experiences"),
      ]);

      const resConfigs =
        results[0].status === "fulfilled" ? results[0].value.data || {} : {};
      const resAbout =
        results[1].status === "fulfilled" ? results[1].value.data || {} : {};
      const resExp =
        results[2].status === "fulfilled" ? results[2].value.data || [] : [];

      const allLoaded = results.every((res) => res.status === "fulfilled");
      if (allLoaded) {
        console.log("✅ Todos os dados carregados!");
      } else {
        console.warn(
          "⚠️ Alguns dados falharam ao carregar, verifique o banco.",
        );
      }

      setConfigs({
        hero_title: resConfigs.hero_title || "Clara Bessa",
        bio_text: resConfigs.bio_text || "",
        cv_url: resConfigs.cv_url || "",

        bio: resAbout.bio || "",
        photo_url: resAbout.photo_url || "",
        technologies: resAbout.technologies || [],
      });

      setExperiences(Array.isArray(resExp) ? resExp : []);

      console.log("✅ Dados sincronizados com sucesso!");
    } catch (err) {
      console.error("❌ Erro crítico ao carregar dados:", err);
    }
  };

  const updateLocalConfig = async (key, value) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      if (["bio", "photo_url"].includes(key)) {
        const formData = new FormData();

        formData.append(key, value);

        const res = await api.post("/panel/about", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setConfigs((prev) => ({
          ...prev,
          [key]: res.data[key] || value,
        }));
      } else {
        await api.put(
          "/panel/configs",
          { configs: { [key]: value } },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setConfigs((prev) => ({ ...prev, [key]: value }));
      }
      console.log(`✅ ${key} salvo com sucesso!`);
    } catch (err) {
      console.error(
        `❌ Erro ao salvar ${key}:`,
        err.response?.data || err.message,
      );
    }
  };

  const handleUpdateExperience = async (id, key, value) => {
    const token = localStorage.getItem("auth_token");
    try {
      await api.put(
        `/panel/experiences/${id}`,
        { [key]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, [key]: value } : exp)),
      );
    } catch (err) {
      console.error("Erro ao atualizar experiência");
    }
  };

  const handleCreateExperience = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await api.post(
        "/panel/experiences",
        {
          company_name: "Nova Empresa",
          role: "Novo Cargo",
          period: "2024 - Atual",
          description: "Descreva suas atividades aqui...",
          tags: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setExperiences((prev) => [res.data, ...prev]);
      setActiveExp(0);

      console.log("✅ Experiência criada com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao criar:", err.response?.data || err.message);
    }
  };

  const handleDeleteExperience = async (id) => {
    const token = localStorage.getItem("auth_token");
    if (!window.confirm("Tem certeza que deseja excluir esta experiência?"))
      return;

    try {
      await api.delete(`/panel/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      setActiveExp(0);
      console.log("✅ Experiência removida");
    } catch (err) {
      console.error("❌ Erro ao excluir");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLogged(false);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  useEffect(() => {
    loadInitialData();
    if (localStorage.getItem("auth_token")) setIsLogged(true);
  }, []);

  return (
    <div className="bg-surface-base text-content-primary min-h-screen px-6 md:px-[10%] pt-32 overflow-x-hidden selection:bg-primary/30">
      {/* Header Fixo */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-surface-base/80 backdrop-blur-md transition-all">
        <div className="px-6 md:px-[10%] py-6 flex justify-between items-center">
          <img
            src="https://res.cloudinary.com/dbr43jqca/image/upload/v1775090801/icon_dikmyu.png"
            className="w-8 md:w-10"
            alt="Logo"
          />
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold">
              <a
                href="#home"
                className={`${activeSection === "home" ? "text-primary" : "text-content-secondary"} hover:text-primary transition-all`}
              >
                <span className="text-primary font-bold">1.</span> home
              </a>
              <a
                href="#sobre"
                className={`${activeSection === "sobre" ? "text-primary" : "text-content-secondary"} hover:text-primary transition-all`}
              >
                <span className="text-primary font-bold">2.</span> sobre
              </a>
              <a
                href="#projetos"
                className={`${activeSection === "projetos" ? "text-primary" : "text-content-secondary"} hover:text-primary transition-all`}
              >
                <span className="text-primary font-bold">3.</span> projetos
              </a>
            </div>
            {isLogged && (
              <button
                onClick={handleLogout}
                className="text-[10px] text-red-400 border border-red-400/30 px-3 py-1 rounded hover:bg-red-400/10 uppercase font-bold"
              >
                Sair
              </button>
            )}
          </div>
        </div>
        <div className="mx-6 md:mx-[10%] border-b border-primary/40"></div>
      </nav>

      {/* Hero */}
      <Hero
        configs={configs}
        isLogged={isLogged}
        onUpdate={updateLocalConfig}
      />

      {/* Sobre Mim */}
      <About
        configs={configs}
        isLogged={isLogged}
        onUpdate={updateLocalConfig}
        calculateAge={calculateAge} 
      />

      {/* Experiência */}
      <Experience
        experiences={experiences}
        activeExp={activeExp}
        setActiveExp={setActiveExp}
        isLogged={isLogged}
        handleCreateExperience={handleCreateExperience}
        handleUpdateExperience={handleUpdateExperience}
        handleDeleteExperience={handleDeleteExperience}
      />

      {/* FOOTER COM GATILHO DE LOGIN SUTIL */}
      <footer className="py-10 border-t border-white/5 flex justify-between items-center text-[10px] text-content-secondary uppercase tracking-widest">
        <p>© 2026 Clara Bessa</p>
        {!isLogged && (
          <span
            onClick={() => setShowLogin(true)}
            className="cursor-pointer hover:text-primary transition-colors px-4 opacity-20"
          >
            .
          </span>
        )}
      </footer>

      {/* MODAL DE LOGIN */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-card p-8 border border-primary/20 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-primary text-xl"
            >
              .
            </button>
            <Login
              onLoginSuccess={() => {
                setIsLogged(true);
                setShowLogin(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
