package br.edu.ifrn.portal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.Properties;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.AfterTestExecutionCallback;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

class SubmissaoProjetoSeleniumTest {
  private static final Properties CONFIGURACAO = carregarConfiguracao();
  private static final String PORTAL_URL = valor("portal.url", "http://localhost:5173");
  private static final String EMAIL = obrigatorio("aluno.email");
  private static final String SENHA = obrigatorio("aluno.senha");

  private WebDriver driver;
  private LoginPage login;
  private SubmissaoPage submissao;

  @RegisterExtension
  final AfterTestExecutionCallback screenshotOnFailure = context -> {
    if (driver == null || context.getExecutionException().isEmpty()) return;

    try {
      Path screenshots = Path.of("target", "screenshots");
      Files.createDirectories(screenshots);
      String filename = context.getDisplayName().replaceAll("[^a-zA-Z0-9.-]", "_") + ".png";
      Files.copy(((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE).toPath(),
          screenshots.resolve(filename), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    } catch (Exception falhaScreenshot) {
      context.publishReportEntry("Screenshot não capturada: " + falhaScreenshot.getClass().getSimpleName());
    }
  };

  @BeforeEach
  void iniciarNavegador() throws Exception {
    ChromeOptions options = new ChromeOptions();
    options.enableBiDi();
    String executavelNavegador = valor("navegador.executavel", "");
    if (executavelNavegador != null && !executavelNavegador.isBlank()) {
      options.setBinary(executavelNavegador);
    }
    options.addArguments(
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-crash-reporter",
        "--disable-breakpad",
        "--user-data-dir=" + java.nio.file.Path.of(System.getProperty("java.io.tmpdir"),
            "portal-selenium-" + java.util.UUID.randomUUID()).toAbsolutePath());

    try {
      String executavelDriver = valor("navegador.driver", "");
      if (executavelDriver == null || executavelDriver.isBlank()) {
        driver = new org.openqa.selenium.chrome.ChromeDriver(options);
      } else {
        ChromeDriverService service = new ChromeDriverService.Builder()
            .usingDriverExecutable(java.nio.file.Path.of(executavelDriver).toFile())
            .build();
        driver = new org.openqa.selenium.chrome.ChromeDriver(service, options);
      }
      driver.manage().window().setSize(new Dimension(1440, 1100));
      driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
      driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
    } catch (Exception falha) {
      throw new IllegalStateException(
          "Não foi possível iniciar o navegador Selenium. Confira navegador.executavel e navegador.driver em selenium.local.properties.",
          falha);
    }

    login = new LoginPage(driver, PORTAL_URL);
    submissao = new SubmissaoPage(driver, new WebDriverWait(driver, Duration.ofSeconds(20)), PORTAL_URL);
  }

  @AfterEach
  void fecharNavegador() {
    if (driver != null) driver.quit();
  }

  @Test
  void alunoRealizaLoginPeloServicoDeUsuarios() {
    login.abrirComoAluno();
    login.autenticarAluno(EMAIL, SENHA);

    assertTrue(driver.getCurrentUrl().contains("/aluno/painel"));
    assertFalse(login.alertaVisivel());
  }

  @Test
  void alunoSubmeteProjetoComDadosEArquivosNosServicosReais() throws Exception {
    login.abrirComoAluno();
    login.autenticarAluno(EMAIL, SENHA);
    submissao.abrirDepoisDoLogin();

    // Confirma a validação da interface antes de criar qualquer registro nos serviços.
    submissao.irParaEtapaProjeto();
    submissao.preencherProjetoIntegradorSemTitulo();
    submissao.continuarParaEquipe();
    assertEquals("Informe título.", submissao.erroDoTitulo());
    assertEquals("true", submissao.tituloInvalido());

    String titulo = "Teste Selenium Portal " + Instant.now().toEpochMilli();
    submissao.preencherTitulo(titulo);
    submissao.continuarParaEquipe();
    submissao.selecionarOrientadorDisponivel();
    submissao.selecionarDisciplinaDisponivel();
    submissao.continuarParaDocumentos();
    submissao.anexarDocumentosObrigatorios();
    submissao.autorizarPublicacao();

    submissao.enviarProjeto();

    assertTrue(submissao.confirmacaoDeEnvioVisivel());
    assertEquals(titulo, submissao.tituloConfirmado());
    assertFalse(submissao.mostraErro());
  }

  private static Properties carregarConfiguracao() {
    Properties properties = new Properties();
    Path arquivo = Path.of("selenium.local.properties");
    if (!Files.exists(arquivo)) return properties;

    try (Reader reader = Files.newBufferedReader(arquivo)) {
      properties.load(reader);
      return properties;
    } catch (IOException falha) {
      throw new IllegalStateException("Não foi possível ler selenium.local.properties.", falha);
    }
  }

  private static String valor(String chave, String padrao) {
    return CONFIGURACAO.getProperty(chave, padrao).trim();
  }

  private static String obrigatorio(String chave) {
    String value = CONFIGURACAO.getProperty(chave, "").trim();
    if (value == null || value.isBlank()) {
      throw new IllegalStateException(
          "Preencha " + chave + " em tests/selenium/selenium.local.properties "
              + "(crie o arquivo a partir de selenium.local.properties.example).");
    }
    return value;
  }
}

