package br.portaldecursos.selenium.tests;

import br.portaldecursos.selenium.config.ConfiguracaoTeste;
import br.portaldecursos.selenium.pages.PaginaLogin;
import br.portaldecursos.selenium.pages.PaginaSubmissao;
import br.portaldecursos.selenium.support.NavegadorFactory;
import br.portaldecursos.selenium.support.ProtecaoAmbiente;
import br.portaldecursos.selenium.support.ScreenshotEmFalha;
import java.net.URI;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;

public abstract class BaseE2ETest {
  protected final ConfiguracaoTeste configuracao = new ConfiguracaoTeste();
  protected WebDriver navegador;
  protected PaginaSubmissao submissao;
  protected URI portal;

  @RegisterExtension
  private final ScreenshotEmFalha screenshotEmFalha = new ScreenshotEmFalha(() -> navegador);

  @BeforeAll
  void iniciarSessaoDoAluno() {
    portal = ProtecaoAmbiente.validarPortal(configuracao);
    try {
      navegador = NavegadorFactory.criar(configuracao);
    } catch (WebDriverException falha) {
      throw new IllegalStateException(
          "Não foi possível iniciar Brave/Chrome. Confirme a instalação ou configure "
              + "navegador.executavel e navegador.driver.", falha);
    }

    PaginaLogin login = new PaginaLogin(navegador, configuracao);
    login.abrir();
    login.autenticarAluno();
    submissao = new PaginaSubmissao(navegador, configuracao);
  }

  @AfterAll
  void fecharNavegador() {
    if (navegador != null) navegador.quit();
  }
}
