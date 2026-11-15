package br.portaldecursos.selenium.pages;

import br.portaldecursos.selenium.config.ConfiguracaoTeste;
import java.nio.file.Path;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public final class PaginaSubmissao {
  private final WebDriver navegador;
  private final ConfiguracaoTeste configuracao;
  private final WebDriverWait espera;

  public PaginaSubmissao(WebDriver navegador, ConfiguracaoTeste configuracao) {
    this.navegador = navegador;
    this.configuracao = configuracao;
    this.espera = new WebDriverWait(navegador, Duration.ofSeconds(configuracao.inteiro("timeout.segundos")));
  }

  public void abrir() {
    navegador.get(configuracao.obrigatorio("portal.url") + configuracao.obrigatorio("rota.submissao"));
    navegador.navigate().refresh();
    espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.FORMULARIO_SUBMISSAO));
    aguardarCursosDaApi();
  }

  public void abrirOutroProjeto() {
    espera.until(ExpectedConditions.elementToBeClickable(Seletores.NOVO_PROJETO)).click();
    espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.CURSO));
    aguardarCursosDaApi();
  }

  public void aguardarCursosDaApi() {
    espera.until(navegador -> new Select(navegador.findElement(Seletores.CURSO)).getOptions().size() > 1);
  }

  public int quantidadeCursosDisponiveis() {
    return new Select(navegador.findElement(Seletores.CURSO)).getOptions().size() - 1;
  }

  public String cursoSelecionado() {
    return new Select(navegador.findElement(Seletores.CURSO)).getFirstSelectedOption().getAttribute("value");
  }

  public void irParaProjeto() {
    continuarAte(Seletores.TIPO);
  }

  public void preencherProjeto(String titulo) {
    new Select(navegador.findElement(Seletores.TIPO)).selectByVisibleText("Projeto Integrador");
    WebElement campoTitulo = espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.TITULO));
    campoTitulo.clear();
    campoTitulo.sendKeys(titulo);
    preencher(Seletores.RESUMO,
        "Aplicação web para organizar dados acadêmicos e apoiar a consulta de informações do curso.");
    preencher(Seletores.OBJETIVOS,
        "Modelar a solução, implementar os recursos principais e avaliar o resultado com usuários.");
    preencher(Seletores.INFORMACOES_ESPECIFICAS,
        "Requisitos: consulta e registro. Escopo: protótipo acadêmico. Solução: aplicação web integrada.");
  }

  public void preencherTitulo(String titulo) {
    WebElement campo = espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.TITULO));
    campo.clear();
    campo.sendKeys(titulo);
  }

  public boolean tituloMarcadoInvalido() {
    return "true".equals(navegador.findElement(Seletores.TITULO).getAttribute("aria-invalid"));
  }

  public String erroDoTitulo() {
    return espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.ERRO_TITULO)).getText();
  }

  public void continuarAte(By proximoElemento) {
    clicar(Seletores.CONTINUAR);
    try {
      espera.until(ExpectedConditions.presenceOfElementLocated(proximoElemento));
    } catch (org.openqa.selenium.TimeoutException falha) {
      String textoPagina = navegador.findElement(By.tagName("body")).getText();
      throw new AssertionError("A etapa não avançou. Conteúdo visível: " + textoPagina, falha);
    }
  }

  public void selecionarOrientadorDaApi() {
    espera.until(navegador -> new Select(navegador.findElement(Seletores.ORIENTADOR)).getOptions().size() > 1);
    new Select(navegador.findElement(Seletores.ORIENTADOR)).selectByIndex(1);
  }

  public int quantidadeOrientadoresDisponiveis() {
    return new Select(navegador.findElement(Seletores.ORIENTADOR)).getOptions().size() - 1;
  }

  public void selecionarDisciplinaDaApi() {
    espera.until(navegador -> new Select(navegador.findElement(Seletores.DISCIPLINA)).getOptions().size() > 1);
    new Select(navegador.findElement(Seletores.DISCIPLINA)).selectByIndex(1);
    espera.until(navegador -> !navegador.findElements(
        By.cssSelector("[data-testid='disciplinas-selecionadas'] button")).isEmpty());
  }

  public int quantidadeDisciplinasDisponiveis() {
    return new Select(navegador.findElement(Seletores.DISCIPLINA)).getOptions().size() - 1;
  }

  public void irParaEquipe() {
    continuarAte(Seletores.ORIENTADOR);
  }

  public void irParaDocumentos() {
    continuarAte(Seletores.DOCUMENTOS_TITULO);
  }

  public void anexarDocumentos(Path diretorioTemporario) {
    try {
      Path requisitos = br.portaldecursos.selenium.support.GeradorPdf.criar(
          diretorioTemporario, "requisitos-projeto.pdf");
      Path relatorio = br.portaldecursos.selenium.support.GeradorPdf.criar(
          diretorioTemporario, "relatorio-tecnico.pdf");
      navegador.findElement(Seletores.DOCUMENTO_REQUISITOS).sendKeys(requisitos.toAbsolutePath().toString());
      navegador.findElement(Seletores.DOCUMENTO_RELATORIO).sendKeys(relatorio.toAbsolutePath().toString());
    } catch (java.io.IOException falha) {
      throw new IllegalStateException("Não foi possível criar os PDFs temporários do teste.", falha);
    }
  }

  public void autorizarPublicacao() {
    WebElement autorizacao = navegador.findElement(Seletores.AUTORIZACAO_PUBLICACAO);
    if (!autorizacao.isSelected()) autorizacao.click();
  }

  public void continuar() {
    clicar(Seletores.CONTINUAR);
  }

  public void enviar() {
    clicar(Seletores.ENVIAR);
    espera.until(navegador -> elementoVisivel(Seletores.TITULO_CONFIRMACAO)
        || elementoVisivel(Seletores.ALERTA_SUBMISSAO));
  }

  public boolean confirmacaoVisivel() {
    return elementoVisivel(Seletores.TITULO_CONFIRMACAO);
  }

  public String mensagemErro() {
    return espera.until(ExpectedConditions.visibilityOfElementLocated(Seletores.ALERTA_SUBMISSAO)).getText();
  }

  private boolean elementoVisivel(By seletor) {
    return navegador.findElements(seletor).stream().anyMatch(WebElement::isDisplayed);
  }

  private void clicar(By seletor) {
    WebElement elemento = espera.until(ExpectedConditions.visibilityOfElementLocated(seletor));
    ((JavascriptExecutor) navegador).executeScript(
        "document.documentElement.style.scrollBehavior = 'auto';"
            + "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});", elemento);
    espera.until(driver -> (Boolean) ((JavascriptExecutor) driver).executeScript(
        "const r = arguments[0].getBoundingClientRect();"
            + "return r.top >= 0 && r.bottom <= window.innerHeight;", elemento));
    espera.until(ExpectedConditions.elementToBeClickable(elemento));
    ((JavascriptExecutor) navegador).executeScript("arguments[0].click();", elemento);
  }

  private void preencher(By seletor, String valor) {
    WebElement campo = espera.until(ExpectedConditions.visibilityOfElementLocated(seletor));
    campo.clear();
    campo.sendKeys(valor);
  }
}
