import Icone from '@/shared/components/Icone.jsx'
import './estados-catalogo.css'

export default function ErroCatalogo({ erro, tentarNovamente, ultimaTentativa }) {
  return (
    <section className="erro-catalogo" role="alert" aria-labelledby="titulo-erro">
      <span className="estado-catalogo__icone">
        <Icone nome="erro-cursos" />
      </span>
      {erro.status > 0 && (
        <small className="erro-catalogo__codigo">Código de resposta: HTTP {erro.status}</small>
      )}
      <h2 id="titulo-erro">Não foi possível carregar os cursos</h2>
      <p>
        Ocorreu uma falha ao consultar o catálogo de cursos. Suas preferências de navegação e
        filtros locais foram preservados.
      </p>
      <div className="estado-catalogo__acoes">
        <button className="botao-primario" onClick={tentarNovamente}>
          <Icone nome="tentar-cursos" />
          Tentar novamente
        </button>
        <a className="botao-secundario" href="#inicio">
          Voltar para o início
        </a>
      </div>
      <small className="erro-catalogo__tentativa">
        <Icone nome="tentativa-cursos" />
        Última tentativa: {ultimaTentativa.toLocaleTimeString('pt-BR')}
      </small>
    </section>
  )
}
