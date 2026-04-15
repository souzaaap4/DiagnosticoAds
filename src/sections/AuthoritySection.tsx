/**
 * Seção de autoridade com especialistas e canais atendidos.
 */
import especialistasImg from "../assets/especialistas.png";
import mercadoLivreLogo from "../assets/logos/mercado-livre.svg";
import shopeeLogo from "../assets/logos/shopee.png";
import amazonLogo from "../assets/logos/amazon.png";

const marketplaces = [
  { name: "Mercado Livre", logo: mercadoLivreLogo },
  { name: "Shopee", logo: shopeeLogo },
  { name: "Amazon", logo: amazonLogo },
];

const authorityPoints = [
  "Diagnóstico de estrutura, verba e rentabilidade por canal.",
  "Prioridades de otimização com impacto direto em margem.",
  "Recomendações práticas para executar nos próximos 7 dias.",
];

export function AuthoritySection() {
  return (
    <section className="section-wrap section-wrap--authority">
      <div className="section-container grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-8 items-center">
        <div
          className="soft-panel motion-reveal authority-photo-panel"
          style={{
            padding: "1.05rem",
            borderColor: "rgba(171,255,16,0.18)",
            background: "linear-gradient(170deg, rgba(10,24,45,0.92), rgba(8,20,39,0.9))",
          }}
        >
          <div className="authority-photo-wrap">
            <img
              src={especialistasImg}
              alt="Especialistas em anúncios para marketplaces"
              style={{ width: "100%", filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.35))" }}
            />
            <span className="authority-photo-fade" aria-hidden="true" />
          </div>
        </div>

        <div className="motion-reveal delay-1">
          <span className="section-tag">Especialistas</span>
          <h2 className="section-title">
            Nossos especialistas analisam contas
            <span style={{ color: "var(--lp-accent)" }}> diariamente</span> dentro de:
          </h2>
          <p className="section-text">
            Entregamos uma leitura completa da sua operação com foco em performance: identificamos
            gargalos, oportunidades de escala e um plano de ação claro para aplicar imediatamente.
          </p>

          <div className="authority-logos mt-5 motion-reveal delay-2" aria-label="Canais analisados">
            {marketplaces.map((marketplace) => (
              <span
                key={marketplace.name}
                className="authority-logo-item"
                title={marketplace.name}
              >
                <img src={marketplace.logo} alt={marketplace.name} style={{ height: "30px", width: "auto" }} />
              </span>
            ))}
          </div>

          <ul className="authority-points mt-6">
            {authorityPoints.map((point) => (
              <li key={point}>
                <span className="authority-points-check" aria-hidden="true">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
