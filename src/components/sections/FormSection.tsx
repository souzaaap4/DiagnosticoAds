/**
 * Seção de formulário (captura de leads) com envio para webhook e redirecionamento de agenda.
 * Inclui seleção de marketplaces e validações básicas no front-end.
 */
import { useState } from "react";
import mercadoLivreLogo from "../../assets/logos/mercado-livre.svg";
import shopeeLogo from "../../assets/logos/shopee.png";
import amazonLogo from "../../assets/logos/amazon.png";
import magaluLogo from "../../assets/logos/magalu.png";

type TrackingData = {
  channel: string;
  source: string;
  medium: string;
  campaign: string;
};

const TRACKING_STORAGE_KEY = "diagnosticoads:tracking";
const DEFAULT_TRACKING: TrackingData = {
  channel: "direto",
  source: "direto",
  medium: "none",
  campaign: "none",
};

const getTrackingData = (): TrackingData => {
  if (typeof window === "undefined") return { ...DEFAULT_TRACKING };
  try {
    const raw = window.localStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRACKING };
    const parsed = JSON.parse(raw) as Partial<TrackingData>;
    return {
      channel: parsed.channel || DEFAULT_TRACKING.channel,
      source: parsed.source || DEFAULT_TRACKING.source,
      medium: parsed.medium || DEFAULT_TRACKING.medium,
      campaign: parsed.campaign || DEFAULT_TRACKING.campaign,
    };
  } catch {
    return { ...DEFAULT_TRACKING };
  }
};

/**
 * Opções de marketplaces exibidas como botões seletivos.
 * A opção "Outros" não possui logo e utiliza marcador visual simples.
 */
const marketplaceOptions = [
  { id: "mercadolivre", label: "Mercado Livre", logo: mercadoLivreLogo },
  { id: "shopee", label: "Shopee", logo: shopeeLogo },
  { id: "amazon", label: "Amazon", logo: amazonLogo },
  { id: "magalu", label: "Magalu", logo: magaluLogo },
  { id: "outros", label: "Outros" },
];

/**
 * Formulário principal com integração n8n e redirecionamento para agenda.
 *
 * @returns JSX.Element
 */
export function FormSection() {
  // URL de agendamento (Google Calendar).
  const calendarUrl = "https://calendar.app.google/zaNXcV4By3HUQuc88";
  // Webhook do n8n responsável por registrar o lead no Google Sheets.
  const webhookUrl = "https://n8n.srv1095468.hstgr.cloud/webhook/DiagnosticoAds";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Armazena apenas digitos para evitar problemas de edicao no mobile.
  const [whatsapp, setWhatsapp] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  // Mantido para fluxo futuro de confirmação sem redirect.
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Alterna a seleção de marketplaces.
   *
   * @param id - Identificador do marketplace.
   * @returns void
   */
  const toggleMarketplace = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toDigits = (value: string) => value.replace(/\D/g, "").slice(0, 11);

  /**
   * Formata o número de WhatsApp no padrão (DD) 9XXXX-XXXX.
   *
   * @param digits - Apenas digitos do número.
   * @returns Número formatado.
   */
  const formatWhatsapp = (digits: string) => {
    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  /**
   * Envia o lead para o webhook do n8n e redireciona para o agendamento.
   *
   * @param e - Evento de submit do formulário.
   * @returns Promise<void>
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Timestamp local para registrar data e hora de entrada do lead.
      const now = new Date();
      const date = now.toLocaleDateString("pt-BR");
      const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      // Payload alinhado às colunas do Google Sheets (inclui espaço no final).
      const tracking = getTrackingData();
      const selectedLabels = selected.map((id) => {
        const option = marketplaceOptions.find((item) => item.id === id);
        return option?.label || id;
      });
      const payload = {
        "Nome completo ": name,
        "E-mail": email,
        "WhatsApp": formatWhatsapp(whatsapp),
        "Data de entrada de leads": date,
        "Data": date,
        "Hora": time,
        "Quais marketplaces você anuncia": selectedLabels,
        "Funil": "DiagnosticoAds",
        channel: tracking.channel,
        source: tracking.source,
        medium: tracking.medium,
        campaign: tracking.campaign,
        timestamp: new Date().toISOString(),
      };

      const body = JSON.stringify(payload);

      // Tenta enviar mesmo durante navegação (mais confiável no redirect).
      let sent = false;
      if (navigator.sendBeacon) {
        sent = navigator.sendBeacon(
          webhookUrl,
          new Blob([body], { type: "text/plain;charset=UTF-8" })
        );
      }

      if (!sent) {
        await Promise.race([
          // Alternativa via fetch em modo no-cors.
          fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body,
            mode: "no-cors",
            keepalive: true,
          }),
          // Evita travar o usuário caso o endpoint demore.
          new Promise((resolve) => setTimeout(resolve, 1200)),
        ]);
      }
    } catch {
      // Mesmo se falhar, seguimos o fluxo para o agendamento.
    } finally {
      // Redirecionamento para a agenda após envio (ou tentativa de envio).
      window.location.href = calendarUrl;
    }
  };

  // Estilos base reutilizados nos campos do formulário.
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(18,24,32,0.85)",
    border: "1px solid var(--lp-border)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
    color: "var(--lp-text)",
    outline: "none",
    fontSize: "1rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  // Logos flutuantes para reforço visual em telas grandes.
  const floatingLogos = [
    { src: amazonLogo, size: 96, left: "6%", top: "4%", rotate: "-8deg", drift: "18px", duration: "18s", delay: "0s", opacity: 0.8 },
    { src: shopeeLogo, size: 90, left: "86%", top: "10%", rotate: "10deg", drift: "-16px", duration: "20s", delay: "-4s", opacity: 0.85 },
    { src: mercadoLivreLogo, size: 120, left: "3%", top: "60%", rotate: "-6deg", drift: "16px", duration: "22s", delay: "-8s", opacity: 0.75 },
    { src: magaluLogo, size: 84, left: "90%", top: "64%", rotate: "8deg", drift: "-14px", duration: "24s", delay: "-12s", opacity: 0.78 },
  ];

  return (
    <section id="formulario" className="relative py-16 md:py-20 px-4 sm:px-6 overflow-hidden" style={{ background: "var(--lp-bg)" }}>
      <style>{`
        @keyframes logo-fall {
          0% { transform: translate3d(0, -50px, 0) rotate(var(--rotation)); opacity: var(--opacity); }
          50% { transform: translate3d(calc(var(--drift) / 2), 60px, 0) rotate(var(--rotation)); opacity: var(--opacity); }
          100% { transform: translate3d(var(--drift), 160px, 0) rotate(var(--rotation)); opacity: var(--opacity); }
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{ background: "var(--lp-glow)" }}
      />
      <div
        className="absolute -top-24 right-[-120px] w-[420px] h-[420px] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(circle at 30% 30%, rgba(86,213,79,0.3), rgba(186,255,0,0.04) 60%)" }}
      />
      <div
        className="absolute -bottom-28 left-[-140px] w-[480px] h-[480px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle at 60% 60%, rgba(186,255,0,0.2), rgba(86,213,79,0.04) 65%)" }}
      />
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ zIndex: 3 }}>
        {floatingLogos.map((logo, index) => (
          <div
            key={`${logo.src}-${index}`}
            className="absolute"
            style={{
              top: logo.top,
              left: logo.left,
              width: logo.size,
              height: logo.size,
              opacity: logo.opacity,
              animation: "logo-fall var(--duration) linear infinite",
              animationDelay: "var(--delay)",
              filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))",
              ["--rotation" as string]: logo.rotate,
              ["--drift" as string]: logo.drift,
              ["--duration" as string]: logo.duration,
              ["--delay" as string]: logo.delay,
              ["--opacity" as string]: String(logo.opacity),
            } as React.CSSProperties}
            aria-hidden="true"
          >
            <img
              src={logo.src}
              alt=""
              className="w-full h-full object-contain"
              style={{ opacity: 1 }}
            />
          </div>
        ))}
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm mb-4"
            style={{
              background: "rgba(186,255,0,0.1)",
              color: "var(--lp-accent)",
              border: "1px solid rgba(186,255,0,0.3)",
            }}
          >
            Formulário 
          </span>
          <h2
            className="text-white"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, lineHeight: 1.25 }}
          >
            Solicite sua análise estratégica
          </h2>
          <p className="mt-3" style={{ color: "var(--lp-muted-2)", fontSize: "1rem" }}>
            Preencha abaixo e nossa equipe entrará em contato em até 24h.
          </p>
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="relative p-6 sm:p-7 md:p-10 rounded-3xl overflow-hidden max-w-2xl mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(28,36,45,0.95) 0%, rgba(20,26,32,0.98) 100%)",
              border: "1px solid rgba(186,255,0,0.25)",
              boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, var(--lp-accent), transparent)" }}
            />

            {/* Nome */}
            <div className="mb-5">
              <label className="block mb-2 text-white" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Nome completo <span style={{ color: "var(--lp-accent)" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(186,255,0,0.6)";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(186,255,0,0.12)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--lp-border)";
                  (e.target as HTMLInputElement).style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.02)";
                }}
              />
            </div>

            {/* E-mail */}
            <div className="mb-5">
              <label className="block mb-2 text-white" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                E-mail <span style={{ color: "var(--lp-accent)" }}>*</span>
              </label>
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(186,255,0,0.6)";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(186,255,0,0.12)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--lp-border)";
                  (e.target as HTMLInputElement).style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.02)";
                }}
              />
            </div>

            {/* WhatsApp */}
            <div className="mb-7">
              <label className="block mb-2 text-white" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                WhatsApp <span style={{ color: "var(--lp-accent)" }}>*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="(11) 99999-9999"
                value={formatWhatsapp(whatsapp)}
                onChange={(e) => setWhatsapp(toDigits(e.target.value))}
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(186,255,0,0.6)";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(186,255,0,0.12)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--lp-border)";
                  (e.target as HTMLInputElement).style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.02)";
                }}
              />
            </div>

            {/* Marketplaces (seleção) */}
            <div className="mb-8">
              <label className="block mb-3 text-white" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Quais marketplaces você anuncia? <span style={{ color: "var(--lp-accent)" }}>*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {marketplaceOptions.map((m) => {
                  const isSelected = selected.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMarketplace(m.id)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: isSelected ? "rgba(186,255,0,0.12)" : "rgba(18,24,32,0.9)",
                        border: isSelected ? "1.5px solid rgba(186,255,0,0.9)" : "1.5px solid rgba(255,255,255,0.08)",
                        color: isSelected ? "var(--lp-accent)" : "var(--lp-muted)",
                        boxShadow: isSelected ? "0 10px 20px rgba(0,0,0,0.25)" : "none",
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: "0.9rem",
                      }}
                    >
                      {m.logo ? (
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <img src={m.logo} alt={m.label} className="h-5 w-auto" />
                        </div>
                      ) : (
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: isSelected ? "var(--lp-accent)" : "#2D3D4A" }}
                        />
                      )}
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Envio */}
            <button
              type="submit"
              disabled={loading || selected.length === 0}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "var(--lp-accent)",
                color: "var(--lp-bg)",
                fontSize: "1.1rem",
                fontWeight: 700,
                boxShadow: "0 0 36px rgba(186,255,0,0.35), 0 12px 30px rgba(0,0,0,0.35)",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="var(--lp-bg)" strokeWidth="4" />
                    <path className="opacity-75" fill="var(--lp-bg)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>Agendar diagnóstico gratuito</span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Aviso de privacidade */}
            <p className="text-center mt-4" style={{ color: "var(--lp-muted-2)", fontSize: "0.8rem" }}>
              DiagnósticoAds | Método P4 
            </p>
          </form>
        ) : (
          <div
            className="p-10 rounded-3xl text-center"
            style={{ background: "var(--lp-bg)", border: "1px solid rgba(86,213,79,0.3)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(86,213,79,0.12)", border: "2px solid rgba(86,213,79,0.4)" }}
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="var(--lp-accent-2)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white mb-3" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Solicitação recebida! 🎉
            </h3>
            <p style={{ color: "var(--lp-muted-2)", lineHeight: 1.7, fontSize: "1rem" }}>
              Nossa equipe entrará em contato via WhatsApp em até <strong style={{ color: "var(--lp-accent)" }}>24 horas</strong> para
              confirmar seu horário e começar a análise.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
