# Regras de consistência da interface

## Cabeçalhos — orientação do usuário

O site público e a área autenticada do professor devem reutilizar o componente src/shared/components/header/Cabecalho.jsx. O header é uma identidade compartilhada, embora login e feed tenham rotas e layouts independentes.

Preservar logo e nome com Cursos em azul, alinhamento no container limite, altura de 64px no desktop e 60px no celular, navegação central, linha de seção ativa, hover, foco visível, menu móvel e seletor de tema por ícone. As ações variam por contexto; não criar outra barra visual para o professor.

Na área do professor: sem link central de Submissões. Ver portal e Sair da conta ficam à direita, acompanhados pelo ícone de Meu perfil e pelo seletor de tema. O logo retorna ao feed. O seletor de tema é o mesmo do portal. No celular, a saída fica no menu para preservar espaço. A navegação da sessão não altera permissões nem o contrato de autenticação.

A tela de login conserva o layout anterior dividido: identidade azul e logo à esquerda, formulário à direita. O título é Acesso institucional, atendendo professor e administrador pelo mesmo POST /auth/login. A barra utilitária permanece compacta. Não substituir novamente pelo card central do kit.

## Painel acadêmico

O professor usa o feed anterior em cards, com filtros à esquerda, e gerencia apenas seu próprio perfil e as submissões. Não apresentar dashboard ou navegação de gestão ao professor. A sidebar pertence exclusivamente à administração, com Visão geral, Professores, Cursos, Projetos, Submissões e Meu perfil. No celular, ela passa para uma faixa horizontal abaixo do header. Reutilizar os tokens, a fonte Manrope, o logo e os temas claro e AMOLED do portal. React e CSS permanecem separados.

Após autenticação e consulta do papel no servidor, ADMIN entra em /administracao/painel e PROFESSOR entra em /professor/feed. /professor/painel redireciona ao feed. O retorno após login deve pertencer à área correta. Não permitir trocar de papel escolhendo uma opção ou digitando outra rota. O header aponta para a área e perfil correspondentes à conta.

As decisões de orientação pertencem ao professor; o administrador acompanha as submissões em consulta, sem assumir o papel do orientador. Cursos e projetos ainda são rascunhos em memória, com essa condição explícita antes da edição. Cadastro/exclusão de professores usa os endpoints existentes; não oferecer edição por ADMIN enquanto o backend restringir PUT /professores/:id a PROFESSOR. Não apresentar gráficos temporais, tendências ou percentuais de crescimento sem dados de origem. Não adicionar páginas de vendas, produtos, estoque, preços, faturas ou mensagens do kit.

## Limite de implementação

Alterações desta tarefa são exclusivamente no frontend. O backend usuarioService não deve ser alterado. Não usar endpoints que não existam no contrato fornecido.

## Perfil do professor

O ícone de perfil abre /professor/perfil, rota protegida. Permite nome, titulação, apresentação e foto JPG/PNG/WebP de até 2 MB. E-mail é somente leitura. Salvar atualiza o estado em memória da sessão e o avatar do header. A interface informa explicitamente que não envia edições ou fotos ao servidor e que recarregar/sair descarta essas alterações. Nenhuma mudança de backend é autorizada por essa tela.
