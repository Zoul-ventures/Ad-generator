import React from 'react';

const PrivacyPage = ({ onBack }) => (
  <div className="legal-wrapper">
    <article className="legal-card">
      <header className="legal-header">
        <h1>Política de Privacidad</h1>
        <p>Última actualización: 31 de marzo de 2024</p>
      </header>

      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          Contento es la responsable de la recopilación y tratamiento de los datos personales
          proporcionados por los Usuarios a través de la Plataforma.
        </p>
      </section>

      <section>
        <h2>2. Datos que recopilamos</h2>
        <ul>
          <li>
            <strong>Datos de cuenta:</strong> nombre, apellidos, correo electrónico, número de teléfono y
            contraseña gestionada por Firebase Authentication.
          </li>
          <li>
            <strong>Datos de uso:</strong> prompts, anuncios generados, historial de imágenes y métricas de
            tokens.
          </li>
          <li>
            <strong>Metadatos técnicos:</strong> dirección IP, dispositivo, navegador y registros de uso para
            mejorar la seguridad y el rendimiento.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidades del tratamiento</h2>
        <p>Utilizamos sus datos para:</p>
        <ol>
          <li>Autenticar usuarios y proteger el acceso a la Plataforma.</li>
          <li>Generar, almacenar y presentar anuncios personalizados.</li>
          <li>Medir el uso de funcionalidades y mejorar la experiencia de usuario.</li>
          <li>Enviar notificaciones relacionadas con la cuenta, servicio o facturación.</li>
        </ol>
      </section>

      <section>
        <h2>4. Base legal</h2>
        <p>
          Tratamos los datos con base en el consentimiento otorgado por el Usuario, la ejecución de la
          relación contractual, y el interés legítimo de Contento para mejorar y proteger sus servicios.
        </p>
      </section>

      <section>
        <h2>5. Conservación</h2>
        <p>
          Los datos se conservarán mientras la cuenta esté activa y durante el tiempo necesario para
          cumplir obligaciones legales o resolver disputas. El Usuario puede solicitar la eliminación de
          su cuenta en cualquier momento.
        </p>
      </section>

      <section>
        <h2>6. Compartición de datos</h2>
        <p>
          Contento no vende datos personales. Podemos compartir información con proveedores de
          servicios que actúan en nuestro nombre (por ejemplo, Firebase) o cuando sea requerido por
          ley. Todos los terceros están obligados a proteger la información bajo acuerdos de
          confidencialidad y cumplimiento de normas de privacidad.
        </p>
      </section>

      <section>
        <h2>7. Derechos de los usuarios</h2>
        <p>
          El Usuario puede ejercer sus derechos de acceso, rectificación, cancelación, oposición,
          portabilidad y limitación escribiendo a{' '}
          <a href="mailto:privacy@contento.app">privacy@contento.app</a>. También puede gestionar gran
          parte de sus datos desde las opciones de cuenta dentro de la Plataforma.
        </p>
      </section>

      <section>
        <h2>8. Seguridad</h2>
        <p>
          Implementamos medidas técnicas y organizativas (cifrado, autenticación, controles de acceso)
          para proteger los datos contra uso no autorizado, pérdida o divulgación. No obstante, ningún
          sistema es infalible; el Usuario comprende los riesgos inherentes a cualquier servicio en línea.
        </p>
      </section>

      <section>
        <h2>9. Transferencias internacionales</h2>
        <p>
          Firebase puede alojar datos fuera del país de residencia del Usuario. Dichas transferencias se
          realizan bajo las salvaguardas adecuadas según la normativa aplicable.
        </p>
      </section>

      <section>
        <h2>10. Cambios en la política</h2>
        <p>
          Contento puede actualizar esta Política de Privacidad en cualquier momento. Publicaremos la
          versión actualizada en la Plataforma e indicaremos la fecha de vigencia. El uso continuado
          implica la aceptación de los cambios.
        </p>
      </section>

      <section>
        <h2>11. Contacto</h2>
        <p>
          Para ejercer derechos o aclarar dudas, escriba a{' '}
          <a href="mailto:privacy@contento.app">privacy@contento.app</a>.
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

export default PrivacyPage;
