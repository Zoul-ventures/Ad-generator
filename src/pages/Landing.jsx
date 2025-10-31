import React from 'react';

const LandingPage = ({ onGetStarted, onOpenTerms, onOpenPrivacy }) => (
  <div className="landing-wrapper">
    <header className="landing-header">
      <div className="landing-brand">
        <img src="/assets/contento vector morado.svg" alt="Contento logo" />
        <span className="landing-tag">Creative co-pilot</span>
      </div>
      <nav className="landing-nav">
        <button type="button" className="link-button" onClick={onOpenTerms}>
          Términos
        </button>
        <button type="button" className="link-button" onClick={onOpenPrivacy}>
          Privacidad
        </button>
      </nav>
    </header>

    <main className="landing-main">
      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1>
            Diseña campañas irresistibles con IA, <span>sin perder tu voz</span>
          </h1>
          <p>
            Contento centraliza tu brief, genera piezas visuales y copy coherente con tu marca,
            mientras guarda cada iteración para tu equipo.
          </p>
          <div className="landing-cta-group">
            <button type="button" className="button primary" onClick={onGetStarted}>
              Comenzar ahora
            </button>
            <button type="button" className="button ghost" onClick={onOpenPrivacy}>
              Conoce cómo protegemos tus datos
            </button>
          </div>
        </div>
        <div className="landing-hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span>Campaña: Nueva colección otoño</span>
              <span className="preview-status">Listo</span>
            </div>
            <div className="preview-body">
              <h3>Dile hola a tu momento de brillar</h3>
              <p>
                Te acompañamos en cada lanzamiento con piezas dinámicas, copy afilado y
                estrategia visual que convierte curiosidad en clientes.
              </p>
              <button type="button" className="cta-button">
                Descubrir la colección
              </button>
            </div>
          </div>
          <div className="preview-metrics">
            <div>
              <strong>+240%</strong>
              <span>Interacción en campañas sociales</span>
            </div>
            <div>
              <strong>12x</strong>
              <span>Iteraciones creativas más rápidas</span>
            </div>
            <div>
              <strong>Equipo alineado</strong>
              <span>Historial centralizado</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <article>
          <h2>Todo tu brief en un solo lugar</h2>
          <p>
            Define objetivos, tono, mood y assets clave. Contento estructura el prompt perfecto para
            tu modelo de IA favorito.
          </p>
        </article>
        <article>
          <h2>Visuales listos para cada plataforma</h2>
          <p>
            Integra imágenes generadas, guarda la versión final en Firebase Storage y comparte el
            enlace con tu equipo.
          </p>
        </article>
        <article>
          <h2>Historial que cuenta la historia</h2>
          <p>
            Cada iteración se almacena con prompts, CTA y métricas de uso. Nunca pierdas una idea que
            funcionó.
          </p>
        </article>
      </section>
    </main>

    <footer className="landing-footer">
      <span>© {new Date().getFullYear()} Contento. Todos los derechos reservados.</span>
      <div className="landing-footer-links">
        <button type="button" className="link-button" onClick={onOpenTerms}>
          Términos
        </button>
        <button type="button" className="link-button" onClick={onOpenPrivacy}>
          Privacidad
        </button>
        <button type="button" className="link-button" onClick={onGetStarted}>
          Iniciar sesión
        </button>
      </div>
    </footer>
  </div>
);

export default LandingPage;
