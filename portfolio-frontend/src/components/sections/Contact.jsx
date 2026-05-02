import { useState } from "react";
import api from "../../services/api";
import EditableConfig from "../EditableConfig";

const Contact = ({ configs, isLogged, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("enviando");
    try {
      await api.post("/contact", formData);
      setStatus("sucesso");
      setFormData({ name: "", email: "", content: "" });
    } catch (err) {
      setStatus("erro");
    }
  };

  return (
    <section id="contato" className="py-24 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* COLUNA ESQUERDA: REDES SOCIAIS */}
        <div className="md:col-span-1 flex flex-col gap-6 uppercase tracking-[0.2em] text-[10px] font-bold pt-2">
          <p className="text-primary mb-2 opacity-50">Siga-me</p>
          <a
            href="https://github.com/clarabessa"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            GITHUB
          </a>
          <a
            href="https://linkedin.com/in/clarabessa"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            LINKEDIN
          </a>
          <a
            href="https://instagram.com/clarabessa"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            INSTAGRAM
          </a>
        </div>

        {/* COLUNA DIREITA: HEADER, TEXTO E FORMULÁRIO */}
        <div className="md:col-span-2 flex flex-col items-start md:items-end">
          {/* HEADER (Replicando o estilo do Sobre Mim) */}
          <div className="flex flex-col items-start md:items-end mb-8 w-full">
            <h2 className="text-2xl font-light text-content-primary uppercase tracking-widest">
              <span className="text-primary font-bold">4.</span>contato
            </h2>
            <div className="w-64 md:w-[450px] border-b-2 border-primary/40 mt-1"></div>
          </div>

          {/* TEXTO DE CONVITE (Alinhado à direita no desktop) */}
          <div className="text-content-secondary leading-relaxed text-base md:text-lg max-w-xl text-left md:text-right mb-12">
            <EditableConfig
              configKey="contact_text"
              value={
                configs?.contact_text ||
                "VAMOS CONVERSAR? ESTOU SEMPRE ABERTA A NOVOS PROJETOS E OPORTUNIDADES."
              }
              isLogged={isLogged}
              onUpdate={onUpdate}
              type="textarea"
            />
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="NOME"
                required
                className="bg-surface-card border border-primary/10 p-4 text-[10px] tracking-widest focus:border-primary outline-none transition-all text-content-primary"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="E-MAIL"
                required
                className="bg-surface-card border border-primary/10 p-4 text-[10px] tracking-widest focus:border-primary outline-none transition-all text-content-primary"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <textarea
              placeholder="MENSAGEM"
              rows="4"
              required
              className="bg-surface-card border border-primary/10 p-4 text-[10px] tracking-widest focus:border-primary outline-none transition-all resize-none text-content-primary"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            ></textarea>

            <button
              type="submit"
              disabled={status === "enviando"}
              className="border border-primary text-primary py-4 px-8 text-[10px] font-bold tracking-[0.2em] hover:bg-primary/10 transition-all disabled:opacity-50 mx-auto md:w-fit"
            >
              {status === "enviando" ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
            </button>

            {status === "sucesso" && (
              <p className="text-green-400 text-[10px] tracking-widest uppercase mt-2 md:text-right">
                Mensagem enviada com sucesso!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
