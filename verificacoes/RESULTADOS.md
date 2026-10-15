# Verificação da interface

Verificado em 15/10/2026 com Edge via Playwright, no servidor local Vite.

- Desktop 1280px: largura de conteúdo 1280px, sem rolagem horizontal.
- Celular 390px: largura de conteúdo 390px, sem rolagem horizontal.
- Nenhuma imagem quebrada e nenhum erro JavaScript observado.
- Modo escuro persistiu após recarregar a página.
- Detalhe de curso abriu e fechou com Escape.
- Menu móvel abriu e atualizou aria-expanded.
- Inspeção visual das capturas de desktop claro, desktop escuro e celular claro concluída.
- ESLint e build de produção passaram.

Chrome, Firefox e Safari não foram executados nesta verificação. Não há backend conectado.

## Catálogo de cursos

Sete nós do Figma integrados como quatro estados do catálogo e componentes de cabeçalho e rodapé. Validação automatizada no Edge com Playwright em 1440px e 390px, com inspeção visual das capturas.

Passaram: busca ignorando acentos, filtros por turno, limpeza, busca sem resultados, carregamento durante consulta, erro HTTP 503, nova tentativa, preservação de filtros, detalhe de curso e Escape, tema AMOLED e painel móvel. Nenhum erro JavaScript ou imagem quebrada observado. Coluna de filtros confirmada geometricamente à esquerda dos resultados em desktop. Lint e build passaram.

Dados locais ilustrativos, sem API institucional conectada. Falha 503 e atraso foram aplicados exclusivamente pela interceptação de rede do teste. Não há seletores públicos de simulação.
