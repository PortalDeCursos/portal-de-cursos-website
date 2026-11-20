import EstadoErro from '@/shared/componentes/EstadoErro.jsx'
import Indicadores from '@/shared/componentes/Indicadores.jsx'
import { useCallback, useEffect, useState } from 'react'
import { enderecoPrivado } from '@/app/rotas.js'
import { buscarResumoAdmin } from '../servicos/buscarResumoAdmin.js'
import '../estilos/indicadores.css'
import '../estilos/registros.css'
import '../estilos/painel.css'

export default function PainelAdministracao({ token }) {
  const [resumo, mudarResumo] = useState(null)
  const [carregando, mudarCarregando] = useState(true)
  const [erro, mudarErro] = useState('')

  const carregar = useCallback(
    async (sinal) => {
      mudarCarregando(true)
      mudarErro('')
      try {
        const dados = await buscarResumoAdmin(token, sinal)
        if (!sinal?.aborted) mudarResumo(dados)
      } catch (falha) {
        if (!sinal?.aborted)
          mudarErro(falha.message || 'Não foi possível carregar os dados acadêmicos.')
      } finally {
        if (!sinal?.aborted) mudarCarregando(false)
      }
    },
    [token],
  )

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => carregar(controller.signal))
    return () => controller.abort()
  }, [carregar])

  return (
    <>
      <header className="painel-titulo administracao-boas-vindas">
        <div>
          <h1>Gestão do portal</h1>
        </div>
        <div className="administracao-boas-vindas__acoes">
          <a className="botao-secundario" href={enderecoPrivado('administracao/cursos')}>
            Ver cursos <span aria-hidden="true">↗</span>
          </a>
          <button className="botao-primario" onClick={() => carregar()} disabled={carregando}>
            {carregando ? 'Atualizando…' : 'Atualizar dados'}
          </button>
        </div>
      </header>
      {erro && (
        <EstadoErro
          titulo="As informações do portal não foram carregadas"
          mensagem="Não foi possível atualizar o painel agora. Tente novamente."
          aoTentarNovamente={() => carregar()}
          carregando={carregando}
        />
      )}
      {carregando && !resumo ? (
        <p className="gestao-aviso" role="status">
          Carregando as informações…
        </p>
      ) : resumo ? (
        <>
          <Indicadores
            rotulo="Resumo da instituição"
            itens={[
              {
                titulo: 'Cursos',
                valor: resumo.cursos.length,
                destino: enderecoPrivado('administracao/cursos'),
                detalhe: 'Formações cadastradas',
                icone: 'cursos-inicio',
              },
              {
                titulo: 'Disciplinas',
                valor: resumo.disciplinas.length,
                destino: enderecoPrivado('administracao/disciplinas'),
                detalhe: 'Componentes curriculares',
                icone: 'disciplinas',
              },
              {
                titulo: 'Campus',
                valor: resumo.campus.length,
                destino: enderecoPrivado('administracao/campus'),
                detalhe: 'Unidades acadêmicas',
                icone: 'campus-detalhe',
              },
              {
                titulo: 'Áreas de conhecimento',
                valor: resumo.areas.length,
                destino: enderecoPrivado('administracao/areas'),
                detalhe: 'Eixos temáticos',
                icone: 'projetos-detalhe',
              },
            ]}
          />
          <section
            className="painel-secao administracao-registros"
            aria-labelledby="cursos-recentes"
          >
            <header>
              <div>
                <h2 id="cursos-recentes">Cursos cadastrados</h2>
              </div>
              <a href={enderecoPrivado('administracao/cursos')}>
                Ver todos os cursos <span aria-hidden="true">→</span>
              </a>
            </header>
            {resumo.cursos.length ? (
              <div
                className="tabela-container"
                role="region"
                aria-label="Formações cadastradas"
                tabIndex={0}
              >
                <table className="tabela">
                  <caption className="somente-leitores">Cursos disponíveis no portal</caption>
                  <thead>
                    <tr>
                      <th scope="col">Curso</th>
                      <th scope="col">Grau</th>
                      <th scope="col">Turno</th>
                      <th scope="col">Modalidade</th>
                      <th scope="col" className="tabela__numero">
                        Carga horária
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumo.cursos.slice(0, 8).map((curso) => (
                      <tr key={curso.id}>
                        <th scope="row">
                          <span className="tabela__titulo">{curso.nome}</span>
                          <span className="tabela__descricao">{curso.sigla || curso.acronimo}</span>
                        </th>
                        <td>{curso.grau}</td>
                        <td>{curso.turno || '—'}</td>
                        <td>{curso.modalidade || '—'}</td>
                        <td className="tabela__numero">{curso.cargaHoraria || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="administracao-vazio">
                <strong>Ainda não há formações cadastradas.</strong>
                <p>Adicione a primeira formação para começar a organizar as matérias.</p>
                <a className="botao-primario" href={enderecoPrivado('administracao/cursos')}>
                  Cadastrar formação
                </a>
              </div>
            )}
          </section>
        </>
      ) : null}
    </>
  )
}
