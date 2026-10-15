# Contribuir

1. Parta de `develop` e crie uma branch `feat/`, `fix/` ou `docs/`.
2. Organize páginas em `src/paginas`, com componentes e serviços por página, em português. Mantenha JSX e CSS separados.
3. Use os tokens existentes e preserve cabeçalho e rodapé compartilhados.
4. Execute `npm run check` na raiz.
5. Para UI, confira desktop, celular, teclado e estados vazio/erro/carregamento. Inclua uma captura no PR.
6. Abra PR para `develop`, descrevendo comportamento, validação e limitações.

Nunca inclua credenciais ou dados reais de alunos em mocks. `.env` fica fora do Git; se uma configuração pública for necessária, documente seu nome em `.env.example`. Variáveis `VITE_*` aparecem no navegador e não podem guardar segredos.

Os documentos acadêmicos atuais são demonstrativos. Valide conteúdo e direitos dos assets antes de uso institucional.
