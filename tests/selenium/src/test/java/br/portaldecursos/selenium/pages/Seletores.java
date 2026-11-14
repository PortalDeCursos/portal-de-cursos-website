package br.portaldecursos.selenium.pages;

import org.openqa.selenium.By;

public final class Seletores {
  private Seletores() {}

  public static final By LOGIN_EMAIL = By.id("identificacao");
  public static final By LOGIN_SENHA = By.id("senha");
  public static final By LOGIN_ENTRAR = By.cssSelector("button.acesso-entrar[type='submit']");

  public static final By FORMULARIO_SUBMISSAO = By.cssSelector("form.formulario-submissao");
  public static final By CURSO = By.cssSelector("[data-testid='curso-submissao']");
  public static final By TIPO = By.cssSelector("[data-testid='tipo-projeto-submissao']");
  public static final By TITULO = By.cssSelector("[data-testid='titulo-projeto-submissao']");
  public static final By RESUMO = By.id("campo-resumo");
  public static final By OBJETIVOS = By.id("campo-objetivos");
  public static final By INFORMACOES_ESPECIFICAS = By.id("campo-informacoes-especificas");
  public static final By ORIENTADOR = By.cssSelector("[data-testid='orientador-submissao']");
  public static final By DISCIPLINA = By.cssSelector("[data-testid='disciplina-submissao']");
  public static final By DISCIPLINAS_SELECIONADAS = By.cssSelector("[data-testid='disciplinas-selecionadas']");
  public static final By DOCUMENTOS_TITULO = By.id("dados-documentos");
  public static final By DOCUMENTO_REQUISITOS = By.cssSelector("[data-testid='arquivo-requisitos']");
  public static final By DOCUMENTO_RELATORIO = By.cssSelector("[data-testid='arquivo-relatorio']");
  public static final By AUTORIZACAO_PUBLICACAO = By.cssSelector("[data-testid='autorizacao-publicacao-submissao']");
  public static final By CONTINUAR = By.cssSelector("[data-testid='submissao-continuar']");
  public static final By ENVIAR = By.cssSelector("[data-testid='submissao-enviar']");
  public static final By NOVO_PROJETO = By.cssSelector("[data-testid='submissao-novo-projeto']");
  public static final By ERRO_TITULO = By.id("erro-titulo");
  public static final By ALERTA_SUBMISSAO = By.cssSelector(".formulario-submissao__erro[role='alert']");
  public static final By TITULO_CONFIRMACAO = By.id("titulo-confirmacao");
}
