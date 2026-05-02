import React, { useState } from "react";
import api from "../services/api";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("auth_token", res.data.token);
      onLoginSuccess();
    } catch (err) {
      alert("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="w-full font-sans">
      <div className="text-center mb-8">
        <h2 className="text-primary font-black uppercase text-xl tracking-[0.2em]">
          Acesso Restrito
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] uppercase text-primary/60 tracking-widest ml-1">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-base border border-primary/20 p-3 text-sm text-content-primary outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,207,200,0.1)] transition-all"
            placeholder="nome@email.com"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase text-primary/60 tracking-widest ml-1">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-base border border-primary/20 p-3 text-sm text-content-primary outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,207,200,0.1)] transition-all"
            placeholder="••••••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-4 bg-primary/5 border border-primary/40 text-primary uppercase text-[10px] font-black tracking-[0.3em] hover:bg-primary hover:text-surface-base transition-all duration-300 shadow-lg"
        >
          Entrar
        </button>
      </form>

      <p className="text-[9px] text-center mt-8 text-content-secondary/40 uppercase tracking-tighter">
        Modo Administrador · Clara Bessa v1.0
      </p>
    </div>
  );
};

export default Login;