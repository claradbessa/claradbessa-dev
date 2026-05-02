import { useState, useEffect } from "react";
import api from "./services/api";
import Login from "./components/Login";
import EditableConfig from "./components/EditableConfig";

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
      <section
        id="home"
        className="relative flex items-center min-h-[80vh] py-20"
      >
        <div className="z-10 w-full max-w-4xl">
          <p className="text-primary text-base md:text-xl mb-4 font-medium">
            Olá, mundo! Eu sou a
          </p>
          <h1 className="text-[clamp(2rem,12vw,5rem)] font-black text-primary uppercase leading-[0.9] tracking-tighter">
            <EditableConfig
              configKey="hero_title"
              value={configs.hero_title}
              isLogged={isLogged}
              onUpdate={updateLocalConfig}
            />
          </h1>
          <div className="mt-8 text-content-secondary text-sm md:text-lg max-w-3xl">
            <EditableConfig
              configKey="bio_text"
              value={configs.bio_text}
              isLogged={isLogged}
              onUpdate={updateLocalConfig}
            />
          </div>
          <a
            href={configs.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block px-10 py-3 border border-primary text-primary hover:bg-primary/10 uppercase tracking-widest text-[10px] font-bold"
          >
            BAIXAR CV
          </a>
        </div>

        <img
          src="https://res.cloudinary.com/dbr43jqca/image/upload/v1775090801/icon_dikmyu.png"
          className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-[500px] opacity-[0.04] pointer-events-none select-none"
          alt="Background Icon"
        />
      </section>

      {/* Sobre Mim */}
      <section className="py-24" id="sobre">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(0,207,200,0.2)]"></div>
            <div className="absolute inset-3 rounded-full overflow-hidden bg-surface-card">
              <img
                src={configs.photo_url || "sua-foto-padrao.jpg"}
                className="w-full h-full object-cover"
                alt="Foto"
              />
            </div>
            {isLogged && (
              <div className="absolute bottom-4 right-4 z-20 bg-surface-base/80 p-2 rounded-full border border-primary/20 backdrop-blur-sm scale-75 hover:scale-100 transition-all">
                <EditableConfig
                  configKey="photo_url"
                  value={configs.photo_url}
                  isLogged={isLogged}
                  onUpdate={updateLocalConfig}
                  type="file"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right">
            <div className="flex flex-col items-start md:items-end mb-8 w-full">
              <h2 className="text-2xl font-light text-content-primary uppercase tracking-widest">
                <span className="text-primary font-bold">2.</span>sobre mim
              </h2>
              <div className="w-64 md:w-[450px] border-b-2 border-primary/40 mt-1"></div>
            </div>
            <h3 className="text-content-secondary font-bold text-sm mb-6 uppercase tracking-widest">
              Clara Bessa · {calculateAge("1999-09-09")} anos · ela/dela
            </h3>
            <div className="text-content-secondary leading-relaxed text-base md:text-lg max-w-xl">
              <EditableConfig
                configKey="bio"
                value={configs.bio}
                isLogged={isLogged}
                onUpdate={updateLocalConfig}
                type="textarea"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Experiência */}
      <section id="experiencia" className="py-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light text-content-primary uppercase tracking-widest mb-12">
          <span className="text-primary font-bold">3.</span>experiência
          <div className="w-64 border-b-2 border-primary/40 mt-1"></div>
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Lista de Empresas (Abas) */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible border-l-2 md:border-l-2 border-primary/10 min-w-[200px]">
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => setActiveExp(index)}
                className={`px-6 py-4 text-left text-xs uppercase tracking-widest transition-all whitespace-nowrap
            ${
              activeExp === index
                ? "text-primary border-l-2 md:border-l-2 border-primary -ml-[2px] bg-primary/5"
                : "text-content-secondary hover:text-primary hover:bg-primary/5"
            }`}
              >
                {exp.company_name}
              </button>
            ))}

            {isLogged && (
              <button
                onClick={handleCreateExperience}
                className="px-6 py-4 text-left text-xs text-green-400 font-bold uppercase opacity-50 hover:opacity-100"
              >
                + Adicionar nova
              </button>
            )}
          </div>

          {/* Detalhes da Experiência Ativa */}
          <div className="flex-1 min-h-[300px]">
            {experiences.length > 0 && experiences[activeExp] ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      <EditableConfig
                        configKey="role"
                        value={experiences[activeExp].role}
                        isLogged={isLogged}
                        onUpdate={(key, val) =>
                          handleUpdateExperience(
                            experiences[activeExp].id,
                            key,
                            val,
                          )
                        }
                      />
                    </h3>

                    {/* Nome da Empresa - Agora Editável */}
                    <div className="text-content-secondary text-sm mt-1">
                      <EditableConfig
                        configKey="company_name"
                        value={experiences[activeExp].company_name}
                        isLogged={isLogged}
                        onUpdate={(key, val) =>
                          handleUpdateExperience(
                            experiences[activeExp].id,
                            key,
                            val,
                          )
                        }
                      />
                    </div>
                  </div>

                  <span className="text-content-secondary font-mono text-sm">
                    <EditableConfig
                      configKey="period"
                      value={experiences[activeExp].period}
                      isLogged={isLogged}
                      onUpdate={(key, val) =>
                        handleUpdateExperience(
                          experiences[activeExp].id,
                          key,
                          val,
                        )
                      }
                    />
                  </span>
                </div>

                <div className="text-content-secondary leading-relaxed text-md space-y-4">
                  <EditableConfig
                    configKey="description"
                    value={experiences[activeExp].description}
                    type="textarea"
                    isLogged={isLogged}
                    onUpdate={(key, val) =>
                      handleUpdateExperience(
                        experiences[activeExp].id,
                        key,
                        val,
                      )
                    }
                  />
                </div>

                {isLogged && (
                  <button
                    onClick={() =>
                      handleDeleteExperience(experiences[activeExp].id)
                    }
                    className="mt-8 text-[10px] text-red-400/50 hover:text-red-400 uppercase font-bold"
                  >
                    Excluir esta experiência
                  </button>
                )}
              </div>
            ) : (
              <p className="text-content-secondary italic">
                Nenhuma experiência encontrada.
              </p>
            )}
          </div>
        </div>
      </section>

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
