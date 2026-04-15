/**
 * Seção de conteúdo: o que será analisado na chamada estratégica.
 */
const analysisItems = [
  {
    title: "Distribuição da verba por campanhas",
    desc: "Onde seu orçamento está concentrado e o que precisa ajustar.",
  },
  {
    title: "Campanhas que travam escala",
    desc: "Gargalos de segmentação, criativo e orçamento.",
  },
  {
    title: "Estrutura alinhada ao seu faturamento",
    desc: "Se o setup atual suporta o nível de vendas que você tem hoje.",
  },
  {
    title: "Pontos de desperdício de investimento",
    desc: "Canais e termos com baixa eficiência.",
  },
  {
    title: "Ajustes práticos de performance",
    desc: "Prioridades claras para executar rápido e melhorar resultado.",
  },
  {
    title: "Plano tático para os próximos 7 dias",
    desc: "Sequência de ações com foco em ganho rápido e sustentável.",
  },
];

export function AnalysisSection() {
  return (
    <section id="analise" className="section-wrap section-wrap--analysis">
      <div className="section-container">
        <div className="analysis-intro text-center max-w-3xl mx-auto mb-8 motion-reveal">
          <span className="section-tag">O que será analisado</span>
          <h2 className="section-title">
            Durante a chamada estratégica você vai descobrir
            <span style={{ color: "var(--lp-accent)" }}> exatamente:</span>
          </h2>
          <p className="section-text">
            Diagnóstico claro, direto ao ponto e com ações práticas para aplicar no mesmo dia.
          </p>
        </div>

        <div className="analysis-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisItems.map((item, index) => (
            <article
              key={item.title}
              className={`analysis-card soft-panel motion-reveal ${index % 2 === 0 ? "delay-1" : "delay-2"}`}
              style={{
                padding: "1rem",
                borderColor: "rgba(171,255,16,0.2)",
                background: "linear-gradient(165deg, rgba(10,24,45,0.9), rgba(8,20,39,0.88))",
              }}
            >
              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "999px",
                  display: "inline-grid",
                  placeItems: "center",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#061022",
                  background: "linear-gradient(130deg, #b7ff2b, #e2ff8d)",
                  boxShadow: "0 0 0 5px rgba(171,255,16,0.14)",
                }}
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <h3 style={{ margin: "0.75rem 0 0", fontSize: "1.08rem", lineHeight: 1.28 }}>{item.title}</h3>
              <p style={{ margin: "0.45rem 0 0", color: "var(--lp-muted)", fontSize: "0.98rem", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </article>
          ))}
        </div>

        <div
          className="analysis-summary max-w-3xl mx-auto mt-8 soft-panel motion-reveal delay-2"
          style={{ padding: "1rem 1.1rem" }}
        >
          <p className="text-center" style={{ margin: 0, lineHeight: 1.55 }}>
            Você sai com <span style={{ color: "var(--lp-accent)", fontWeight: 700 }}>direcionamento claro</span> e{" "}
            <span style={{ color: "var(--lp-accent)", fontWeight: 700 }}>prioridades definidas.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
