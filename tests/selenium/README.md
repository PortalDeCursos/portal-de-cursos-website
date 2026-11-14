# Testes Selenium integrados

Os cenários usam o navegador para autenticar um aluno e submeter um Projeto Integrador pelos
serviços reais do Portal de Cursos. O teste não substitui `fetch`, não injeta sessão e não cria
respostas ou dados de API simulados.

O fluxo validado cobre login do aluno, consulta real de curso, professor e disciplina, validação do
título, cadastro da submissão e envio dos dois PDFs obrigatórios. O Selenium gera arquivos PDF
mínimos e fictícios em diretório temporário. A submissão é gravada no ambiente local e pode acionar
as notificações configuradas nos serviços; não execute estes testes contra produção.

## Pré-requisitos

- Java 21 ou superior
- Node.js compatível com o projeto
- Gateway e microsserviços locais ativos, incluindo os serviços de usuários e projetos
- Portal Vite iniciado em `http://localhost:5173`
- Chrome ou Brave instalado
- Conta de aluno criada pelo seeder do serviço de usuários
- Arquivo local `selenium.local.properties` configurado uma vez

## Executar

Na raiz do frontend, inicie o portal:

```powershell
npm run dev -- --host 0.0.0.0
```

Na pasta `tests/selenium`, crie o arquivo local de configuração a partir do exemplo e informe os
dados da conta criada pelo seeder. O arquivo local é ignorado pelo Git e a senha não será publicada.

```powershell
Copy-Item .\selenium.local.properties.example .\selenium.local.properties
notepad .\selenium.local.properties
.\mvnw.cmd test
```

O arquivo aceita `portal.url`, `aluno.email`, `aluno.senha` e, opcionalmente,
`navegador.executavel` e `navegador.driver`. Deixe os dois últimos vazios para usar o Selenium
Manager, ou preencha-os para selecionar um navegador e driver instalados localmente.

Depois da configuração inicial, basta manter o portal e os serviços ativos e executar
`.\mvnw.cmd test` na pasta `tests/selenium`.

Em caso de falha, o navegador salva uma captura em `target/screenshots`.

