package br.portaldecursos.selenium.pages;

import br.portaldecursos.selenium.config.ConfiguracaoTeste;
import java.time.Duration;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public final class PaginaLogin {
  private final WebDriver navegador;
  private final ConfiguracaoTeste configuracao;
  private final WebDriverWait espera;

  public PaginaLogin(WebDriver navegador, ConfiguracaoTeste configuracao) {
    this.navegador = navegador;
    this.configuracao = configuracao;
    this.espera = new WebDriverWait(navegador, Duration.ofSeconds(configuracao.inteiro("timeout.segundos")));
  }

  public void abrir() {
    String url = configuracao.obrigatorio("portal.url") + configuracao.obrigatorio("rota.login");
    try {
      navegador.get(url);
      espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.LOGIN_EMAIL));
    } catch (RuntimeException falha) {
      throw new IllegalStateException(
          "Portal não acessível ou formulário de login indisponível em " + url
              + ". Verifique se o Vite está ativo e se a rota corresponde ao frontend.", falha);
    }
  }

  public void autenticarAluno() {
    navegador.findElement(Seletores.LOGIN_EMAIL).sendKeys(configuracao.obrigatorio("aluno.email"));
    navegador.findElement(Seletores.LOGIN_SENHA).sendKeys(configuracao.obrigatorio("aluno.senha"));
    navegador.findElement(Seletores.LOGIN_ENTRAR).click();
    try {
      espera.until(ExpectedConditions.urlContains("/aluno/painel"));
    } catch (TimeoutException falha) {
      String alerta = navegador.findElements(org.openqa.selenium.By.cssSelector("[role='alert']"))
          .stream().filter(elemento -> elemento.isDisplayed()).map(elemento -> elemento.getText())
          .findFirst().orElse("O portal não confirmou o login.");
      throw new IllegalStateException("Não foi possível autenticar a conta do seeder: " + alerta, falha);
    }
  }
}
