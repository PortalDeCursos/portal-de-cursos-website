import DesignIcon from '../../components/ui/DesignIcon';
import PrototypeAction from '../../components/ui/PrototypeAction';

export default function SubmissionBanner() {
  return (
    <section className="submission-banner">
      <div className="submission-content">
        <p className="submission-eyebrow">
          <DesignIcon name="imgContainer6" />
          Fluxo de extensão e pesquisa
        </p>
        <h2>Seu projeto também pode fazer parte.</h2>
        <p className="submission-description">
          Envie sua produção acadêmica em PDF. Após a avaliação do orientador, os projetos aprovados
          ficam disponíveis para consulta pública.
        </p>
        <p className="submission-note">Não é necessário ter uma conta para enviar.</p>
      </div>
      <div className="submission-action">
        <span className="submission-action-label">Compartilhe sua produção</span>
        <PrototypeAction className="primary-button">
          <DesignIcon name="imgContainer7" />
          Submeter projeto
        </PrototypeAction>
      </div>
    </section>
  );
}
