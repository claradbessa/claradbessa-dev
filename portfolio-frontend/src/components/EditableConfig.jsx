import { useState, useEffect } from "react";

export default function EditableConfig({ configKey, value, onUpdate, isLogged, type = "text" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(configKey, tempValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return <span dangerouslySetInnerHTML={{ __html: value || "" }} />;
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 w-full min-w-[300px] md:min-w-[600px] bg-surface-card p-4 border border-primary/40 rounded-lg shadow-2xl">
        
        {type === "file" ? (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="w-full bg-black/40 border border-primary/20 p-3 text-content-primary rounded-md focus:border-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
              onChange={(e) => setTempValue(e.target.files[0])} 
            />
            {tempValue && tempValue instanceof File && (
              <p className="text-[10px] text-primary uppercase font-bold">Arquivo: {tempValue.name}</p>
            )}
          </div>
        ) : type === "textarea" ? (
          <textarea
            className="w-full bg-black/40 border border-primary/20 p-4 text-content-primary rounded-md h-80 font-mono text-sm focus:border-primary outline-none"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Digite o texto aqui... Aceita <b>negrito</b> e <span class='text-primary'>cores</span>"
          />
        ) : (
          <input
            className="w-full bg-black/40 border border-primary/20 p-3 text-content-primary rounded-md focus:border-primary outline-none"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        )}
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={() => setIsEditing(false)} 
            className="px-4 py-2 text-[10px] uppercase font-bold text-content-secondary hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-primary/20 border border-primary/40 px-6 py-2 rounded text-[10px] uppercase font-bold text-primary hover:bg-primary hover:text-black transition-all"
          >
            {loading ? "Salvando..." : "✅ Salvar Alterações"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block group min-h-[1.5em] min-w-[20px]">
      <span 
        className={!value ? "opacity-20 italic text-sm" : ""}
        dangerouslySetInnerHTML={{ __html: value || "(Adicione um texto/foto)" }} 
      />
      <button 
        onClick={() => setIsEditing(true)} 
        className="ml-3 inline-flex items-center justify-center w-8 h-8 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary hover:text-black transition-all cursor-pointer shadow-sm"
        title="Editar este campo"
      >
        <span className="text-sm">✏️</span>
      </button>
    </div>
  );
}