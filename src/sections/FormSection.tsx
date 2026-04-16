/**
 * Seção de captura de lead com envio para webhook e redirecionamento.
 */
import { useState, type CSSProperties, type FocusEvent, type FormEvent } from "react";
import mercadoLivreLogo from "../assets/logos/mercado-livre.svg";
import shopeeLogo from "../assets/logos/shopee.png";
import amazonLogo from "../assets/logos/amazon.png";
import magaluLogo from "../assets/logos/magalu.png";
import { APP_CONFIG } from "../config/runtime";
import { getTrackingData } from "../lib/tracking";
import { formatWhatsapp, toDigits } from "../lib/whatsapp";

type MarketplaceOption = {
  id: string;
  label: string;
  logo?: string;
};

type AmbientLogo = {
  src: string;
  size: number;
  left: string;
  duration: string;
  delay: string;
  drift: string;
  rotation: string;
  opacity: number;
};

const marketplaceOptions: MarketplaceOption[] = [
  { id: "mercadolivre", label: "Mercado Livre", logo: mercadoLivreLogo },
  { id: "shopee", label: "Shopee", logo: shopeeLogo },
  { id: "amazon", label: "Amazon", logo: amazonLogo },
  { id: "magalu", label: "Magalu", logo: magaluLogo },
  { id: "outros", label: "Outros" },
];

const adInvestmentOptions = [
  "Não invisto ainda",
  "Até R$5.000/mês",
  "R$5.000 a R$10.000/mês",
  "R$10.000 a R$15.000/mês",
  "Mais de R$15.000/mês",
];

const ambientLogos: AmbientLogo[] = [
  {
    src: amazonLogo,
    size: 88,
    left: "9%",
    duration: "16s",
    delay: "-1s",
    drift: "20px",
    rotation: "-10deg",
    opacity: 0.58,
  },
  {
    src: shopeeLogo,
    size: 82,
    left: "87%",
    duration: "18s",
    delay: "-6s",
    drift: "-18px",
    rotation: "11deg",
    opacity: 0.54,
  },
  {
    src: mercadoLivreLogo,
    size: 96,
    left: "4%",
    duration: "19s",
    delay: "-9s",
    drift: "14px",
    rotation: "-7deg",
    opacity: 0.5,
  },
  {
    src: magaluLogo,
    size: 78,
    left: "90%",
    duration: "20s",
    delay: "-11s",
    drift: "-12px",
    rotation: "8deg",
    opacity: 0.5,
  },
];

const marketplaceLabelsById = Object.fromEntries(
  marketplaceOptions.map((option) => [option.id, option.label]),
) as Record<string, string>;

const handleFieldFocus = (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  event.currentTarget.style.borderColor = "rgba(171,255,16,0.7)";
  event.currentTarget.style.boxShadow = "0 0 0 3px rgba(171,255,16,0.16)";
  event.currentTarget.style.backgroundColor = "rgba(6,18,36,0.96)";
};

const handleFieldBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  event.currentTarget.style.borderColor = "rgba(122,150,186,0.45)";
  event.currentTarget.style.boxShadow = "none";
  event.currentTarget.style.backgroundColor = "rgba(8,20,39,0.92)";
};

export function FormSection() {
  const { calendarUrl, leadWebhookUrl } = APP_CONFIG;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [confirmWhatsapp, setConfirmWhatsapp] = useState("");
  const [adInvestment, setAdInvestment] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const hasWhatsappMismatch =
    confirmWhatsapp.length > 0 && toDigits(whatsapp) !== toDigits(confirmWhatsapp);

  const toggleMarketplace = (id: string) => {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (toDigits(whatsapp) !== toDigits(confirmWhatsapp)) {
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const date = now.toLocaleDateString("pt-BR");
      const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const tracking = getTrackingData();
      const selectedLabels = selected.map((id) => marketplaceLabelsById[id] || id);

      const payload = {
        "Nome completo": name.trim(),
        "E-mail": email.trim(),
        WhatsApp: formatWhatsapp(whatsapp),
        "Confirmar WhatsApp": formatWhatsapp(confirmWhatsapp),
        "Data de entrada de leads": date,
        Data: date,
        Hora: time,
        "Quanto você investe em publicidade nos marketplaces hoje?": adInvestment,
        "Em quais canais": selectedLabels,
        Funil: "DiagnosticoAds",
        channel: tracking.channel,
        source: tracking.source,
        medium: tracking.medium,
        campaign: tracking.campaign,
        timestamp: new Date().toISOString(),
      };

      if (leadWebhookUrl) {
        const body = JSON.stringify(payload);

        let sent = false;
        if (navigator.sendBeacon) {
          sent = navigator.sendBeacon(
            leadWebhookUrl,
            new Blob([body], { type: "text/plain;charset=UTF-8" }),
          );
        }

        if (!sent) {
          await Promise.race([
            fetch(leadWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "text/plain;charset=UTF-8" },
              body,
              mode: "no-cors",
              keepalive: true,
            }),
            new Promise((resolve) => setTimeout(resolve, 1200)),
          ]);
        }
      } else {
        console.warn("[DiagnosticoAds] VITE_LEAD_WEBHOOK_URL não configurada.");
      }
    } catch (error) {
      console.error("[DiagnosticoAds] Falha no envio do lead:", error);
    } finally {
      window.location.assign(calendarUrl);
    }
  };

  return (
    <section
      id="formulario"
      className="section-wrap section-wrap--form relative overflow-hidden"
    >
      <div className="form-logo-rain" aria-hidden="true">
        {ambientLogos.map((logo, index) => (
          <span
            key={`${logo.src}-${index}`}
            className="form-logo-fall"
            style={
              {
                left: logo.left,
                width: logo.size,
                height: logo.size,
                opacity: logo.opacity,
                ["--fall-duration" as string]: logo.duration,
                ["--fall-delay" as string]: logo.delay,
                ["--fall-drift" as string]: logo.drift,
                ["--fall-rotation" as string]: logo.rotation,
                ["--fall-opacity" as string]: String(logo.opacity),
              } as CSSProperties
            }
          >
            <img src={logo.src} alt="" />
          </span>
        ))}
      </div>

      <div className="section-container relative z-20">
        <div className="soft-panel form-shell motion-reveal max-w-[780px] mx-auto">
          <div className="text-center max-w-3xl mx-auto motion-reveal delay-1">
            <span className="section-tag">Formulário</span>
            <h2 className="section-title">
              Solicite sua análise estratégica
            </h2>
            <p className="section-text">
              Preencha abaixo e nossa equipe entrará em contato em até 24h.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-7 max-w-[640px] grid grid-cols-1 md:grid-cols-2 gap-4 form-grid motion-reveal delay-2"
          >
            <div className="md:col-span-2">
              <label htmlFor="lead-name" className="form-field-label">
                Nome completo
              </label>
              <input
                id="lead-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className="field-input"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="lead-email" className="form-field-label">
                E-mail
              </label>
              <input
                id="lead-email"
                type="email"
                required
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="lead-whatsapp" className="form-field-label">
                WhatsApp
              </label>
              <input
                id="lead-whatsapp"
                type="tel"
                required
                autoComplete="tel"
                inputMode="numeric"
                placeholder="(11) 99999-9999"
                value={formatWhatsapp(whatsapp)}
                onChange={(event) => setWhatsapp(toDigits(event.target.value))}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="lead-whatsapp-confirm" className="form-field-label">
                Confirmar WhatsApp
              </label>
              <input
                id="lead-whatsapp-confirm"
                type="tel"
                required
                autoComplete="tel"
                inputMode="numeric"
                placeholder="Repita o WhatsApp"
                value={formatWhatsapp(confirmWhatsapp)}
                onChange={(event) => setConfirmWhatsapp(toDigits(event.target.value))}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                aria-invalid={hasWhatsappMismatch}
                className="field-input"
              />
              {hasWhatsappMismatch ? (
                <p style={{ margin: "0.4rem 0 0", color: "#ff8f8f", fontSize: "0.86rem" }}>
                  Os números de WhatsApp não conferem.
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="lead-investment" className="form-field-label">
                Quanto você investe em publicidade nos marketplaces hoje?
              </label>
              <select
                id="lead-investment"
                required
                value={adInvestment}
                onChange={(event) => setAdInvestment(event.target.value)}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                className="field-input"
              >
                <option value="">Selecione uma opção</option>
                {adInvestmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <p className="form-field-label mb-2">
                Em quais canais
              </p>
              <div className="form-channels-grid">
                {marketplaceOptions.map((marketplace) => {
                  const isSelected = selected.includes(marketplace.id);
                  return (
                    <button
                      type="button"
                      key={marketplace.id}
                      onClick={() => toggleMarketplace(marketplace.id)}
                      aria-pressed={isSelected}
                      className="market-button flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                      style={{
                        border: isSelected
                          ? "1.5px solid rgba(171,255,16,0.85)"
                          : "1.5px solid rgba(118,147,184,0.42)",
                        background: isSelected ? "rgba(171,255,16,0.14)" : "rgba(8,20,38,0.8)",
                        color: "#dfe9f7",
                        cursor: "pointer",
                      }}
                    >
                      {marketplace.logo ? (
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "1px solid rgba(118,147,184,0.4)",
                            background: "rgba(16,35,61,0.86)",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <img src={marketplace.logo} alt={marketplace.label} style={{ maxHeight: "18px", width: "auto" }} />
                        </span>
                      ) : (
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "999px",
                            background: isSelected ? "#b7ff2b" : "#7e98ba",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span className="market-button-label" style={{ fontWeight: isSelected ? 700 : 600 }}>
                        {marketplace.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                selected.length === 0 ||
                adInvestment.length === 0 ||
                confirmWhatsapp.length === 0 ||
                hasWhatsappMismatch
              }
              className="md:col-span-2 lp-btn lp-btn-primary w-full mt-1"
            >
              {loading ? "Enviando..." : "Agendar diagnóstico gratuito"}
            </button>

            <p
              className="md:col-span-2 text-center"
              style={{ margin: "0.25rem 0 0", color: "var(--lp-muted-2)", fontSize: "0.84rem" }}
            >
              DiagnósticoAds | Método P4
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
