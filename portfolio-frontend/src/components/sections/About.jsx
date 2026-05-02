import EditableConfig from "../EditableConfig";

const About = ({ configs, isLogged, onUpdate, calculateAge }) => {
  return (
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
                onUpdate={onUpdate}
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
              value={configs?.bio || ""}
              isLogged={isLogged}
              onUpdate={onUpdate} 
              type="textarea"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
