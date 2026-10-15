# Portal de Cursos

Interface React e Vite baseada nos designs do Figma para Início e Cursos, com JSX e CSS separados e organização por página em português.

## Executar

```sh
npm install
npm run dev
```

## Validar

```sh
npm run lint
npm run build
```

Consulte [DESIGN-E-REGRAS.md](./DESIGN-E-REGRAS.md) para as convenções e decisões visuais.

Dados locais ilustrativos. Autenticação, submissão e documentos reais dependem da futura integração aos microsserviços.

## Catálogo

Acesse `/#cursos` pelo menu. Busca, ordenação, filtros à esquerda e etiquetas removíveis funcionam com os dados demonstrativos de `public/dados/cursos.json`. Os estados de carregamento, erro e busca vazia decorrem da consulta real e dos filtros. Em telas menores, os filtros ficam em um painel recolhível.

Para integrar o serviço de Cursos, configure `VITE_API_CURSOS` com um endpoint GET que retorne uma lista no formato do JSON demonstrativo. Reinicie o Vite após alterar a configuração. O catálogo local é usado quando a variável não está definida.

Os cenários de interface estão em `verificacoes/conferir-catalogo.cjs` e os resultados em `verificacoes/catalogo-resultados.json`. A execução requer Playwright com Edge disponível no ambiente.
