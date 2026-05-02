import EditableConfig from "../EditableConfig";

const Experience = ({
  experiences,
  activeExp,
  setActiveExp,
  isLogged,
  handleCreateExperience,
  handleUpdateExperience,
  handleDeleteExperience,
}) => {
  return (
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
                    handleUpdateExperience(experiences[activeExp].id, key, val)
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
  );
};

export default Experience;
