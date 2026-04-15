/**
 * Seção Hero da landing page com proposta principal e CTA.
 */
export function HeroSection() {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="section-wrap section-wrap--hero hero-stage">
      <div
        className="section-container motion-reveal hero-panel max-w-[980px]"
      >
        <div className="relative z-10 text-center mx-auto motion-reveal delay-1 hero-content">
          <p className="hero-kicker mb-6 uppercase">
            Diagnóstico Ads
          </p>

          <h1 className="section-title hero-headline mx-auto">
            Se o conteúdo do vídeo fez sentido para você,
            <br className="hero-break" />
            <span style={{ color: "var(--lp-accent)" }}>o próximo passo é aplicar isso</span>
            <br className="hero-break" />
            diretamente em sua conta.
          </h1>

          <p className="section-text hero-subtitle mx-auto">
            Receba um diagnóstico estratégico gratuito para identificar onde seus anúncios no Mercado Livre,
            Shopee ou Amazon estão limitando sua escala.
          </p>

          <div className="mt-7">
            <button type="button" onClick={scrollToForm} className="lp-btn lp-btn-primary">
              Agendar diagnóstico gratuito
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div className="hero-proof hero-proof-strip mt-12 md:mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2 motion-reveal delay-2">
            {[
              "Gratuito, sem pegadinha",
              "Análise real por especialistas",
              "Resultado aplicável imediatamente",
            ].map((item) => (
              <div key={item} className="hero-proof-item flex items-center gap-2">
                <span style={{ color: "var(--lp-accent-2)", fontWeight: 700 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
