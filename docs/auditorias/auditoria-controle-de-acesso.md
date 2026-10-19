# Auditoria UX — controle de acesso e cabeçalho

## Target

Cabeçalho público/autenticado, entrada por URL direta e redirecionamento por perfil do Portal de Cursos.

## Evidence Available

- `source`: `src/shared/components/header/Cabecalho.jsx`, `src/app/Aplicacao.jsx`, `src/app/rotas.js`, `src/api/v1/autenticacao.js`, `src/api/v1/usuarios.js` e `.github/workflows/pages.yml` foram inspecionados em 2026-10-19.
- `automated`: o roteiro local `.taste-skill/verificar-papeis.cjs` registrou navegação por professor e administrador, bloqueio de área cruzada e ausência de overflow global nos tamanhos testados. Ele usa respostas interceptadas; portanto não comprova o contrato de produção.
- `screenshot`: `.taste-skill/professor-feed-restaurado.png`, `.taste-skill/professor-feed-restaurado-celular.png` e `.taste-skill/administracao-painel-desktop.png` existem como evidência visual local.

## Ran

- Leitura do componente do header, das guardas de rota, cliente de autenticação e workflow de Pages.
- Conferência do artefato de validação local por perfil e das capturas disponíveis.

## Skipped

- Validação contra API de homologação ou produção: não foi usada conta autorizada nesta auditoria.
- Teste da URL publicada de administração: depende do destino real de deploy e da decisão de `A-DEPLOY-001`.
- Auditoria automática de acessibilidade: não há relatório axe/Lighthouse neste escopo.

## Severity Matrix

| Severity | Finding                                                                                                                                                                               | Evidence              | Impact                                                                                                                                                   | Fix                                                                                                                               | Verification                                                               |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| P1       | Visitante recebe Área do Professor e Administração no menu principal; ambos também são repetidos no grupo de ações.                                                                   | source                | Expõe caminhos privados, cria ruído e contradiz a navegação pública definida.                                                                            | Usar uma matriz de visibilidade: quatro links públicos e Entrar para visitante; uma única área contextual por perfil autenticado. | Inspecionar DOM nos três perfis e comparar com a matriz aprovada.          |
| P1       | A sessão é estado em memória. Ao recarregar, a guarda trata a pessoa como não autenticada e não há contrato individual para revalidar a conta.                                        | source                | Uma URL direta não consegue retomar sessão válida; o redirecionamento pode funcionar para visitante, mas não atende revalidação por JWT após recarregar. | Resolver `A-AUTH-001` antes de implementar persistência/restauração de sessão.                                                    | Abrir rota privada com token válido, inválido e expirado em nova aba.      |
| P1       | O workflow de Pages só copia `index.html` para login e rotas de professor; rotas administrativas não têm fallback explícito.                                                          | source                | `/administracao` pode não chegar ao SPA no deploy e a guarda não executará.                                                                              | Resolver `A-DEPLOY-001`: expandir fallback ou adotar convenção de URL compatível com Pages.                                       | Abrir todas as rotas privadas publicadas em janela anônima.                |
| P2       | A identificação pós-login consulta listas de usuários/professores para descobrir a própria conta.                                                                                     | source                | Aumenta custo, depende de formato de lista e mistura autenticação com busca administrativa.                                                              | Formalizar identidade da sessão por resposta de login ou endpoint autenticado de conta atual.                                     | Teste de integração confirma resposta mínima por conta e 401/403 corretos. |
| P2       | A navegação móvel da administração é horizontal; as capturas mostram que alguns rótulos podem começar fora do campo visível, embora não haja overflow global confirmado pelo roteiro. | screenshot, automated | Descoberta de seções pode ficar menos imediata em telas estreitas.                                                                                       | Na fase de matriz, definir indicador de rolagem/estado ativo e ordem de prioridade móvel.                                         | Capturas em 320 px e navegação por teclado/touch em todas as abas.         |

## Refactor Brief

1. Aprovar o contrato de identidade autenticada e a estratégia de fallback de Pages antes do código.
2. Usar a matriz em `docs/controle-de-acesso/FEATURE-PREPARATION.md` como critério único do header.
3. Implementar a guarda apenas após a identidade da sessão poder ser validada pelo servidor.
4. Validar o fluxo completo em ambiente publicado, sem registrar tokens ou dados pessoais.

## Privacy Notes

Não foram incluídos token, senha, e-mail real ou captura de uma conta autenticada nesta auditoria. A evidência automatizada local com respostas interceptadas não deve ser confundida com integração real.

## Residual Risk

Até os alarmes `A-AUTH-001` e `A-DEPLOY-001` serem resolvidos, não é possível afirmar que uma URL privada direta funciona de forma segura após reload no ambiente publicado.
