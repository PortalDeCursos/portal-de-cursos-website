import { useEffect } from 'react'
import { basePortal } from '@/app/rotas.js'

export default function PaginaPoliticaPrivacidade() {
  useEffect(() => {
    document.title = 'Política de Privacidade — Portal de Cursos'
  }, [])

  return (
    <main id="conteudo" className="limite" style={{ paddingBlock: '48px', maxWidth: '760px' }}>
      <h1>Política de Privacidade</h1>
      <p>
        O Portal de Cursos respeita a privacidade de visitantes, estudantes, docentes e
        coordenadores.
      </p>
      <h2>Armazenamento no navegador</h2>
      <p>
        Este portal não utiliza cookies de rastreamento, não grava dados em armazenamento local e
        mantém a sessão autenticada exclusivamente na memória da aba aberta. Ao recarregar ou fechar
        a página, o acesso retorna ao modo visitante.
      </p>
      <h2>Dados acadêmicos exibidos</h2>
      <p>
        As informações públicas de cursos, disciplinas, docentes e projetos publicados são exibidas
        com finalidade estritamente institucional e acadêmica.
      </p>
      <p>
        <a className="ligacao" href={`${basePortal}#inicio`}>
          Voltar à página inicial
        </a>
      </p>
    </main>
  )
}
