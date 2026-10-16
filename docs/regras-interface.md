# Regras de consistência da interface

## Cabeçalhos — orientação do usuário

O site público e a área autenticada do professor devem reutilizar o componente src/shared/components/header/Cabecalho.jsx. O header é uma identidade compartilhada, embora login e feed tenham rotas e layouts independentes.

Preservar logo e nome com Cursos em azul, alinhamento no container limite, altura de 64px no desktop e 60px no celular, navegação central, linha de seção ativa, hover, foco visível, menu móvel e seletor de tema por ícone. As ações variam por contexto; não criar outra barra visual para o professor.

Na área do professor: sem link central de Submissões. Ver portal e Sair da conta ficam à direita, acompanhados pelo ícone de Meu perfil e pelo seletor de tema. O logo retorna ao feed. O seletor de tema é o mesmo do portal. No celular, a saída fica no menu para preservar espaço. A navegação da sessão não altera permissões nem o contrato de autenticação.

A tela de login conserva seu layout próprio com card dividido e barra utilitária compacta. Não adicionar novamente o header público completo ao login sem solicitação.

## Limite de implementação

Alterações desta tarefa são exclusivamente no frontend. O backend usuarioService não deve ser alterado. Não usar endpoints que não existam no contrato fornecido.

## Perfil do professor

O ícone de perfil abre /professor/perfil, rota protegida. Permite nome, titulação, apresentação e foto JPG/PNG/WebP de até 2 MB. E-mail é somente leitura. Salvar atualiza o estado em memória da sessão e o avatar do header. A interface informa explicitamente que não envia edições ou fotos ao servidor e que recarregar/sair descarta essas alterações. Nenhuma mudança de backend é autorizada por essa tela.
