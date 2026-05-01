import { useState, useEffect } from "react";
import api from "./services/api";
import Login from "./components/Login";
import EditableConfig from "./components/EditableConfig";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
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
      const [resConfigs, resAbout] = await Promise.all([
        api.get("/configs"),
        api.get("/about"), 
      ]);

      setConfigs({
        hero_title: resConfigs.data.hero_title || "Clara Bessa",
        bio_text: resConfigs.data.bio_text || "",
        cv_url: resConfigs.data.cv_url || "",

        bio: resAbout.data?.bio || "",
        photo_url: resAbout.data?.photo_url || "",
        technologies: resAbout.data?.technologies || [],
      });

      console.log("✅ Todos os dados carregados com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao carregar dados:", err);
    }
  };

  const updateLocalConfig = async (key, value) => {
    const token = localStorage.getItem("token");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
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
    if (localStorage.getItem("token")) setIsLogged(true);
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
              ✕
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
