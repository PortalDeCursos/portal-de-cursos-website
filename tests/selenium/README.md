# Testes Selenium integrados

Os cenários autenticam um aluno pelo formulário do portal e submetem um Projeto Integrador pelos microsserviços reais. O teste não injeta sessão, não substitui `fetch` e não simula respostas das APIs.

## Pré-requisitos

- Java 21 ou superior
- Node.js compatível com o frontend
- Portal Vite, gateway e microsserviços locais ativos, incluindo usuários e projetos
- Brave ou Chrome instalado
- Conta de aluno disponível pelo seeder do serviço de usuários

O navegador Brave é detectado automaticamente nos caminhos comuns do Windows, macOS e Linux. Se não for encontrado, o módulo procura Chrome. O Selenium Manager resolve o driver quando `navegador.driver` estiver vazio.

## Executar

Na raiz do frontend, inicie o portal, caso ainda não esteja ativo:

```powershell
npm run dev -- --host 0.0.0.0
```

Com os serviços locais ativos, entre em `tests/selenium` e execute:

```powershell
.\mvnw.cmd test
```

O arquivo versionado `src/test/resources/selenium.defaults.properties` já define URL, conta do seeder e rotas. Não é necessário copiar arquivos nem configurar variáveis de ambiente.

## Regras cobertas

| ID | Cenário |
| --- | --- |
| RN01 | Aluno autenticado abre a submissão sem voltar ao login |
| RN02 | Cursos, orientadores e disciplinas são carregados e selecionados pelas APIs reais |
| RN03 | Título vazio é bloqueado |
| RN04 | Título composto apenas por espaços é bloqueado |
| RN05 | Título acima do limite real de 255 caracteres é rejeitado |
| RN06 | Submissão com os dois PDFs obrigatórios é gravada e confirmada |
| RN07 | Submissão repetida com o mesmo título é rejeitada pelo backend |
| RN08 | Submissão sem os documentos obrigatórios é bloqueada |

## Configuração opcional

A precedência é `-Dchave=valor` > `selenium.local.properties` > `selenium.defaults.properties`. Por exemplo:

```powershell
.\mvnw.cmd test "-Dportal.url=http://localhost:5173" "-Dheadless=true"
```

Para ajustes persistentes apenas na máquina local, crie `selenium.local.properties` ao lado do `pom.xml`. O arquivo é ignorado pelo Git. Propriedades aceitas incluem `portal.url`, `aluno.email`, `aluno.senha`, `navegador.executavel`, `navegador.driver`, `headless` e `timeout.segundos`.

## Segurança e dados de teste

A proteção bloqueia hosts externos por padrão e aceita localhost ou endereços de redes privadas. Os testes criam submissões reais no ambiente local e podem enviar notificações pelos serviços. Cada execução usa um título único, e os PDFs mínimos são criados em diretório temporário. Não execute contra produção.

## Solução de problemas

- **Portal ou formulário indisponível:** confirme Vite, rota e microsserviços; a configuração padrão usa `http://localhost:5173`.
- **Seletores não encontrados:** confira os `data-testid` estáveis adicionados aos campos e botões do formulário.
- **Brave ou driver incompatível:** verifique a versão em `brave://version`. Se necessário, defina `navegador.executavel` e `navegador.driver` no arquivo local ou por `-D`.
- **Capturas de falha:** os screenshots ficam em `target/screenshots`.
