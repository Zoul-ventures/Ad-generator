import React from 'react';

const TermsPage = ({ onBack }) => (
  <div className="legal-wrapper">
    <article className="legal-card">
      <header className="legal-header">
        <h1>Términos y Condiciones de Uso</h1>
        <p>Última actualización: 31 de marzo de 2024</p>
      </header>

      <section>
        <h2>1. Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar la plataforma Contento (la <strong>“Plataforma”</strong>), usted acepta
          cumplir con estos Términos y Condiciones de Uso (<strong>“Términos”</strong>). Si no está de
          acuerdo con alguno de los puntos, le solicitamos que no utilice la Plataforma.
        </p>
      </section>

      <section>
        <h2>2. Definiciones</h2>
        <p>
          <strong>“Usuario”</strong>: persona física o representante de una persona moral que accede y
          utiliza la Plataforma.<br />
          <strong>“Contenido”</strong>: textos, imágenes, materiales publicitarios o cualquier dato que se
          genere o cargue dentro de la Plataforma.<br />
          <strong>“Servicios”</strong>: todas las funcionalidades proporcionadas por Contento,
          incluyendo generación de anuncios, almacenamiento de imágenes y herramientas de historial.
        </p>
      </section>

      <section>
        <h2>3. Registro y cuenta</h2>
        <ol>
          <li>Es necesario registrarse con una cuenta válida de Firebase Authentication.</li>
          <li>
            El Usuario es responsable de mantener la confidencialidad de sus credenciales y de toda
            actividad realizada con su cuenta.
          </li>
          <li>
            Contento se reserva el derecho de suspender o cancelar cuentas que incumplan estos
            Términos o que hagan un uso indebido de la Plataforma.
          </li>
        </ol>
      </section>

      <section>
        <h2>4. Uso permitido</h2>
        <p>
          La Plataforma está destinada a la creación y gestión de anuncios publicitarios generados con
          apoyo de IA. El Usuario se compromete a:
        </p>
        <ul>
          <li>Proporcionar información veraz y precisa sobre su marca o campaña.</li>
          <li>No subir contenido ilícito, difamatorio, discriminatorio o que infrinja derechos de terceros.</li>
          <li>No intentar vulnerar la seguridad ni interferir con el funcionamiento de la Plataforma.</li>
        </ul>
      </section>

      <section>
        <h2>5. Propiedad intelectual</h2>
        <p>
          Todos los elementos visuales, conceptuales y de software de Contento son propiedad exclusiva
          de sus titulares. El Usuario conserva los derechos sobre el contenido que cargue o genere,
          pero otorga a Contento una licencia no exclusiva para alojarlo y procesarlo a efectos de
          brindar los Servicios.
        </p>
      </section>

      <section>
        <h2>6. Planes y tokens</h2>
        <p>
          Contento puede operar bajo un modelo de tokens o créditos. El saldo de tokens se descuenta
          por cada generación de anuncio o uso de recursos específicos. Los tokens no son
          reembolsables y caducan según la política vigente en cada momento.
        </p>
      </section>

      <section>
        <h2>7. Limitación de responsabilidad</h2>
        <p>
          Contento presta la Plataforma “tal cual”, sin garantías expresas o implícitas. No nos
          responsabilizamos por daños directos o indirectos derivados del uso o imposibilidad de uso de
          la Plataforma. El Usuario es responsable de revisar y aprobar cualquier anuncio antes de su
          publicación.
        </p>
      </section>

      <section>
        <h2>8. Modificaciones</h2>
        <p>
          Contento se reserva el derecho de modificar estos Términos en cualquier momento. Los
          cambios entrarán en vigor una vez publicados en la Plataforma. El uso continuado implica la
          aceptación de las modificaciones.
        </p>
      </section>

      <section>
        <h2>9. Contacto</h2>
        <p>
          Para dudas o comentarios, puede escribirnos a{' '}
          <a href="mailto:legal@contento.app">legal@contento.app</a>.
        </p>
      </section>
      <div className="legal-actions">
        <button type="button" className="button ghost legal-back" onClick={onBack}>
          Volver
        </button>
      </div>
    </article>
  </div>
);

export default TermsPage;
