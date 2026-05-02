import EditableConfig from "../EditableConfig";

const Hero = ({ configs, isLogged, onUpdate }) => {
  return (
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
            value={configs?.hero_title || ""}
            isLogged={isLogged}
            onUpdate={onUpdate} 
          />
        </h1>
        <div className="mt-8 text-content-secondary text-sm md:text-lg max-w-3xl">
          <EditableConfig
            configKey="bio_text"
            value={configs.bio_text}
            isLogged={isLogged}
            value={configs.bio_text}
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
  );
};

export default Hero;
