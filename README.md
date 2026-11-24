# Portal de Cursos

Frontend em React e Vite para consultar cursos e trabalhos publicados, submeter projetos e acompanhar as avaliações do orientador e da coordenação. Este guia usa a branch `develop` do site e PowerShell no Windows.

## Início rápido no workspace já configurado

Na pasta que contém os seis repositórios e o iniciador local, execute:

```powershell
.\iniciar-backends.bat --verificar
.\iniciar-backends.bat
```

O primeiro comando confere os pré-requisitos, identifica portas livres e testa os serviços já ativos. O segundo inicia as dependências e aguarda as respostas HTTP. Abra [o portal local](http://localhost:5173/#inicio). Os logs do iniciador ficam em `%LOCALAPPDATA%\PortalDeCursos\Logs`.

O BAT pertence ao workspace local. Para preparar uma máquina apenas com os repositórios do GitHub, siga o passo a passo abaixo.

## 1. Preparar os repositórios

Instale Git, Node.js 24 com npm, JDK 21, PostgreSQL e RabbitMQ. Configure `JAVA_HOME` para a pasta do JDK. Confira com `node -v`, `npm -v` e `java -version`. Os serviços incluem o Maven Wrapper.

Em uma pasta de trabalho nova, clone os repositórios lado a lado:

```powershell
git clone --branch develop https://github.com/PortalDeCursos/portal-de-cursos-website.git
git clone https://github.com/PortalDeCursos/usuarioService.git
git clone https://github.com/PortalDeCursos/portal-de-cursos-mscursos.git
git clone https://github.com/PortalDeCursos/portal-de-cursos-projects.git
git clone https://github.com/PortalDeCursos/portal-de-cursos-notificacoes.git
git clone https://github.com/PortalDeCursos/ApiGateway.git
```

## 2. Preparar bancos e configurações

Inicie o PostgreSQL na porta 5432 e o RabbitMQ na 5672. Para uma instalação nova, execute os comandos abaixo **uma vez** no pgAdmin ou no psql, conectado ao banco de manutenção `postgres`. Execute cada comando separadamente, fora de uma transação. Se um banco já existir, mantenha-o.

```sql
CREATE DATABASE "usuarioDB";
CREATE DATABASE cursos;
CREATE DATABASE projetos;
```

Na pasta que contém os repositórios, copie os modelos apenas quando o respectivo arquivo local estiver ausente:

```powershell
foreach ($servico in 'usuarioService','portal-de-cursos-mscursos','portal-de-cursos-projects','portal-de-cursos-notificacoes','ApiGateway') {
    $modelo = if ($servico -eq 'portal-de-cursos-projects') { '.env.exemplo' } else { '.env.example' }
    if (!(Test-Path "$servico/.env")) { Copy-Item "$servico/$modelo" "$servico/.env" }
}
```

| Serviço | Porta | O que conferir no modelo local |
| --- | ---: | --- |
| Usuários | 8081 | Banco `usuarioDB`, credenciais do PostgreSQL, contexto `/api/usuarios`, pasta gravável para fotos e `JWT_SECRET`. |
| Cursos | 8082 | `DB_URL=jdbc:postgresql://localhost:5432/cursos`, `DB_USERNAME` e `DB_PASSWORD`. |
| Projetos | 8083 | `DB_URL=jdbc:postgresql://localhost:5432/projetos`, credenciais do PostgreSQL e acesso ao RabbitMQ. |
| Notificações | 8084 | Acesso ao RabbitMQ e credenciais SMTP locais para o envio de e-mail. |
| API Gateway | 8765 | Mesmo valor de `JWT_SECRET` usado pelo serviço de Usuários. |
| Frontend | 5173 | O Vite encaminha as chamadas `/api` ao Gateway local. |

Mantenha senhas e chaves nos arquivos locais. O Flyway cria as tabelas durante a inicialização. A migração V7 de Cursos inclui os dados iniciais do catálogo. Se apenas os registros forem apagados, reiniciar o serviço preserva o catálogo vazio porque o histórico já registra a execução da V7.

## 3. Iniciar os serviços manualmente

Use um terminal por serviço, dentro da pasta do respectivo repositório. Para Usuários, Cursos, Notificações e Gateway, execute:

```powershell
$env:SPRING_CONFIG_IMPORT = 'optional:file:./.env[.properties]'
.\mvnw.cmd '-Dmaven.test.skip=true' '-Dspring-boot.run.jvmArguments=-Xms32m -Xmx256m' spring-boot:run
```

Inicie **Projetos** depois que Usuários e Cursos estiverem disponíveis. Na pasta `portal-de-cursos-projects`, informe as duas integrações:

```powershell
$env:SPRING_CONFIG_IMPORT = 'optional:file:./.env[.properties]'
.\mvnw.cmd '-Dmaven.test.skip=true' '-Dspring-boot.run.jvmArguments=-Xms32m -Xmx256m' '-Dspring-boot.run.arguments=--servico-cursos.url=http://localhost:8082/api/academico --servico-usuarios.url=http://localhost:8081/api/usuarios' spring-boot:run
```

Na pasta `portal-de-cursos-website`:

```powershell
npm ci
npm run dev -- --port 5173 --strictPort
```

Acesse [a página inicial](http://localhost:5173/#inicio). Para encerrar os processos iniciados manualmente, use Ctrl+C nos respectivos terminais.

## 4. Conferir a integração

Faça as consultas abaixo em outro terminal. Elas usam o mesmo caminho do navegador, passando pelo Vite e pelo Gateway:

```powershell
$catalogo = Invoke-RestMethod 'http://localhost:5173/api/academico/cursos'
$catalogo | Select-Object totalElements
$catalogo.content | Select-Object id, nome
Invoke-RestMethod 'http://localhost:5173/api/projetos/projetos/aprovados'
```

Como visitante, abra **Explorar cursos**, escolha um curso e consulte a grade curricular. Para testar os fluxos privados, entre com uma conta local do papel correspondente. O professor pode submeter projetos. A coordenação avalia os projetos vinculados ao seu curso.

## 5. Rodar as verificações

Na raiz do frontend:

```powershell
npm run check
npm run test:contratos
npm run format:check
```

`check` executa ESLint e a compilação de produção. `test:contratos` verifica regras de integração e de repetição de consultas. `format:check` confere a formatação. O build gera a pasta `dist`.

Para o teste integrado, mantenha o ambiente local ativo, configure uma conta de aluno em `tests/selenium/selenium.local.properties` e execute:

```powershell
cd tests/selenium
.\mvnw.cmd test "-Dheadless=true"
```

A suíte Selenium cria projetos e anexos no banco configurado e pode acionar e-mails. Use dados de teste. Consulte os [pré-requisitos, cenários e relatórios do Selenium](tests/selenium/README.md).

## Diagnóstico rápido

| Sintoma | O que conferir |
| --- | --- |
| A página abre e o catálogo está vazio | Confira `totalElements` na consulta acima e os registros do banco `cursos`. |
| A avaliação informa que o curso está sem coordenador | Na gestão de professores, associe o coordenador ao curso correto. Confira a designação antes de repetir a decisão. |
| Projetos informa que não consegue consultar Usuários | Confira a porta 8081 e o endereço de integração no comando do serviço de Projetos. Consulte o andamento no painel antes de repetir uma decisão. |
| O aviso de e-mail fica sem confirmação | A chamada direta do frontend usa `POST /api/notificacoes`. A configuração de Gateway revisada não expõe essa rota. O serviço tem uma entrada local em `/api/notificacao/notificacoes` na porta 8084 e também consome eventos do RabbitMQ. Confira os logs de Notificações para verificar a entrega. |
| O Vite informa que a porta está ocupada | Identifique quem usa a 5173 antes de iniciar outra instância. O modo `--strictPort` evita abrir o site em outra porta sem perceber. |
