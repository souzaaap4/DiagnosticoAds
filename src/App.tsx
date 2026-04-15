/**
 * App principal da landing page DiagnósticoAds.
 * Organiza a sequência de seções e o rodapé da aplicação.
 */
import { HeroSection } from "./sections/HeroSection";
import { AnalysisSection } from "./sections/AnalysisSection";
import { AuthoritySection } from "./sections/AuthoritySection";
import { ScarcitySection } from "./sections/ScarcitySection";
import { FormSection } from "./sections/FormSection";
import logoP4 from "./assets/01.png";

/**
 * Componente raiz da aplicação.
 *
 * @returns JSX.Element
 */
export default function App() {
  return (
    <div className="app-shell w-full min-h-screen">
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo
      </a>
      <div className="ambient-glow" aria-hidden="true" />
      <div className="vector-bg" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar-content">
          <a className="topbar-brand" href="#inicio" aria-label="Método P4 Ads">
            <span className="topbar-logo" aria-hidden="true">
              <img src={logoP4} alt="" className="topbar-logo-img" />
            </span>
            <span className="topbar-copy">
              <strong>Método P4</strong>
              <small>ADS</small>
            </span>
          </a>
          <a className="mini-cta" href="#formulario">
            Garantir análise
          </a>
        </div>
      </header>

      <main id="conteudo-principal" className="page-main">
        {/* Bloco 1 – Hero */}
        <HeroSection />

        {/* Bloco 2 – O que será analisado */}
        <AnalysisSection />

        {/* Bloco 3 – Autoridade */}
        <AuthoritySection />

        {/* Bloco 4 – Escassez Controlada */}
        <ScarcitySection />

        {/* Bloco 5 – Formulário Estratégico */}
        <FormSection />
      </main>

      <footer className="footer-bar">
        <p>© {new Date().getFullYear()} Método P4. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
