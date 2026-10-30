# Estrutura do frontend

O frontend usa React com Vite e organiza o código por domínio de interface.

```text
src/
├── api/                 # clientes e recursos HTTP por domínio
├── app/                 # rotas e composição principal da aplicação
├── assets/              # imagens e fontes
├── pages/               # telas organizadas em português
│   ├── inicio/
│   ├── cursos/
│   ├── detalhes-curso/
│   ├── projetos/
│   ├── submissao/
│   ├── professor/
│   ├── cadastro-aluno/
│   └── painel-aluno/
├── shared/              # componentes e estilos reutilizados
└── styles/              # estilos globais e tokens de tema
```

## API

Cada arquivo de `src/api/` representa um recurso do backend: `cursos`,
`disciplinas`, `usuarios`, `alunos`, `professores`, `coordenadores`,
`submissoes` e `autenticacao`. As telas e serviços importam somente as funções
necessárias, por exemplo:

```js
import { listarCursos } from '@/api/cursos.js'
```

`cliente.js` concentra a configuração de requisições, autenticação e tratamento
de falhas. A versão do endpoint continua definida pelos serviços de backend;
ela não cria uma camada de pastas no frontend.

## Responsabilidades

- `api/` realiza chamadas HTTP e normaliza as respostas do backend.
- `pages/<domínio>/services/` guarda composição de dados específica de uma tela.
- Componentes e páginas não usam `fetch` diretamente.
- `shared/components/` contém apenas elementos empregados por mais de uma área.
- Os tokens visuais ficam em `styles/tokens.css`; estilos globais ficam em
  `styles/globais.css`.
