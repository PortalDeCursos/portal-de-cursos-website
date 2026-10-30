# Regras de consistência da interface

## Cabeçalhos — orientação do usuário

O site público e a área autenticada do professor devem reutilizar o componente src/shared/components/header/Cabecalho.jsx. O header é uma identidade compartilhada, embora login e feed tenham rotas e layouts independentes.

Preservar logo e nome com Cursos em azul, alinhamento no container limite, altura de 64px no desktop e 60px no celular, navegação central, linha de seção ativa, hover, foco visível, menu móvel e seletor de tema por ícone. As ações variam por contexto; não criar outra barra visual para o professor.

Na área do professor: sem link central de Submissões. Ver portal e Sair da conta ficam à direita, acompanhados pelo ícone de Meu perfil e pelo seletor de tema. O logo retorna ao feed. O seletor de tema é o mesmo do portal. No celular, a saída fica no menu para preservar espaço. A navegação da sessão não altera permissões nem o contrato de autenticação.

A tela de login conserva o layout anterior dividido: identidade azul e logo à esquerda, formulário à direita. O título é Acesso institucional, atendendo professor e administrador pelo mesmo POST /auth/login. A barra utilitária permanece compacta. Não substituir novamente pelo card central do kit.

## Hierarquia e fluxo de submissões

- ADMIN gere o portal e os coordenadores, administra as contas e os conteúdos de qualquer curso e consulta todas as submissões sem avaliá-las.
- COORDENADOR é um professor designado para um curso. A área de coordenação filtra cursos, disciplinas, professores, projetos e submissões pelo `cursoId` associado à conta. Pode submeter projetos e aceitar, recusar, editar ou remover as submissões do curso.
- PROFESSOR vê as submissões em que aparece como orientador, faz a avaliação inicial das submissões de alunos e também pode submeter projetos diretamente à etapa do coordenador.
- A submissão de aluno aguarda o orientador. Quando aceita, segue para avaliação do coordenador. A aprovação do coordenador publica o projeto; a recusa exige justificativa.
- Aluno autenticado acompanha somente submissões em que consta como autor ou integrante, não edita submissões e não avalia projetos. Cadastro e autenticação próprios dependem do serviço de contas de aluno.
- O administrador designa coordenadores ao cadastrar cursos escolhendo um professor. A associação do curso e a gestão de contas dependem de endpoints administrativos ainda ausentes no contrato frontend.
- A notificação por e-mail à coordenação após o aceite do orientador depende de integração de notificações; a interface não simula envio de e-mail.

## Painel acadêmico

O professor usa o feed anterior em cards, com filtros à esquerda, e gerencia apenas seu próprio perfil e as submissões que orienta. A coordenação tem uma sidebar própria para o curso designado; a sidebar administrativa fica reservada ao ADMIN. No celular, as sidebars passam para uma faixa horizontal abaixo do header. Reutilizar os tokens, a fonte Manrope, o logo e os temas claro e AMOLED do portal. React e CSS permanecem separados.

Após autenticação e consulta do papel no servidor, ADMIN entra em /administracao/painel, COORDENADOR em /coordenacao/painel e PROFESSOR em /professor/feed. /professor/painel redireciona ao feed. O retorno após login deve pertencer à área correta. Não permitir trocar de papel escolhendo uma opção ou digitando outra rota. O header aponta para a área e perfil correspondentes à conta.

As decisões são separadas por etapa: o professor orientador faz a avaliação inicial e o coordenador decide a publicação. O administrador consulta submissões, sem avaliá-las. Cursos, disciplinas, projetos e decisões desta interface são rascunhos em memória até a integração com os serviços correspondentes. Não apresentar gráficos temporais, tendências ou percentuais de crescimento sem dados de origem. Não adicionar páginas de vendas, produtos, estoque, preços, faturas ou mensagens do kit.

## Limite de implementação

Alterações desta tarefa são exclusivamente no frontend. O backend usuarioService não deve ser alterado. Não usar endpoints que não existam no contrato fornecido.

## Perfil do professor

O ícone de perfil abre /professor/perfil, rota protegida. Permite nome, titulação, apresentação e foto JPG/PNG/WebP de até 2 MB. E-mail é somente leitura. Salvar atualiza o estado em memória da sessão e o avatar do header. A interface informa explicitamente que não envia edições ou fotos ao servidor e que recarregar/sair descarta essas alterações. Nenhuma mudança de backend é autorizada por essa tela.
