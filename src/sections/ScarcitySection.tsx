/**
 * Seção de vídeo e disponibilidade de horários.
 */
import { useState } from "react";
import videoCover from "../assets/video-capa.png";

export function ScarcitySection() {
  const videoId = "ZP3qVjw32es";
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="section-wrap section-wrap--scarcity">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-10 motion-reveal">
          <span className="section-tag">Próximo Passo</span>
          <h2 className="section-title">
            Assista ao vídeo e entenda o próximo passo da sua análise
          </h2>
          <p className="section-text">
            O vídeo explica como funciona o diagnóstico e, ao lado, você vê a disponibilidade de horários.
          </p>
        </div>

        <div className="scarcity-layout grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr] items-start">
          <div
            className="soft-panel motion-reveal delay-1"
            style={{
              overflow: "hidden",
              borderColor: "rgba(149,175,211,0.34)",
              background: "rgba(7,17,33,0.88)",
            }}
          >
            <div className="relative w-full aspect-video">
              {isPlaying ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="Vídeo diagnóstico"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    border: "none",
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  aria-label="Assistir ao vídeo"
                >
                  <img src={videoCover} alt="Capa do vídeo de apresentação" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
          </div>

          <aside
            className="soft-panel motion-reveal delay-2"
            style={{
              padding: "clamp(1.1rem, 3vw, 1.8rem)",
              borderColor: "rgba(171,255,16,0.3)",
              background:
                "radial-gradient(560px circle at 8% 8%, rgba(171,255,16,0.14), transparent 50%), linear-gradient(160deg, rgba(11,26,48,0.95), rgba(8,20,39,0.95))",
            }}
          >
            <span className="section-tag" style={{ marginBottom: "0.9rem" }}>
              Vagas Limitadas
            </span>
            <h3 style={{ margin: 0, fontSize: "clamp(1.18rem, 2.3vw, 1.65rem)", lineHeight: 1.25 }}>
              Para garantir profundidade na análise, liberamos apenas
              <span style={{ color: "var(--lp-accent)" }}> 3 horários por dia.</span>
            </h3>
            <p className="section-text" style={{ marginBottom: "1rem" }}>
              Quando as agendas fecham, novas vagas são abertas conforme disponibilidade. Se você está
              vendo essa página, ainda há horários disponíveis.
            </p>
            <p className="scarcity-human-note">
              <span className="scarcity-human-note-icon" aria-hidden="true">✦</span>
              <span>
                Análise realizada por especialistas —
                <strong> não é sistema automatizado.</strong>
              </span>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
