# Contribuir

## Branches

`main` contém produção e releases. `develop` é a integração das features. Crie branches
curtas a partir de `develop` e abra pull requests de volta para `develop`:

- `feat/<descricao>` para funcionalidades;
- `fix/<descricao>` para correções;
- `refactor/<descricao>` para reorganizações sem mudança de produto;
- `docs/<descricao>` para documentação;
- `hotfix/<descricao>` somente para correções urgentes originadas de `main`.

Branches de release saem de `develop`, recebem apenas ajustes de versão e documentação e
entram em `main` por merge commit. Depois da publicação, sincronize `main` de volta com
`develop`.

## Commits

Use o formato Conventional Commits, por exemplo:

```text
feat(cursos): adiciona filtro por modalidade
fix(icones): corrige caminho dos assets
docs: atualiza fluxo de contribuição
```

O hook local do Husky valida a mensagem com commitlint. Não use credenciais, dados reais de
alunos ou arquivos gerados em commits.

## Código e estrutura

1. Organize páginas em `src/pages`, com componentes e serviços por domínio.
2. Mantenha JSX e CSS separados e reutilize os tokens existentes.
3. Siga [a estrutura do projeto](docs/ESTRUTURA.md): nomes de arquivos e pastas não devem
   conter acentos nem a pasta `servicos`.
4. Componentes compartilhados ficam em `src/shared`; chamadas HTTP ficam em `src/api`.

## Pull requests

Antes de abrir o PR para `develop`, execute:

```bash
npm ci
npm run check
npm run format:check
npm run check:structure
```

Para alterações de interface, confira desktop, celular, teclado e estados vazio, erro e
carregamento. Inclua captura de tela e descreva limitações de integração. Use o template de
PR e vincule a issue ou o card do Jira.

Nunca inclua credenciais ou dados reais de alunos em mocks. `.env` fica fora do Git; se uma configuração pública for necessária, documente seu nome em `.env.example`. Variáveis `VITE_*` aparecem no navegador e não podem guardar segredos.

Os documentos acadêmicos atuais são demonstrativos. Valide conteúdo e direitos dos assets antes de uso institucional.
