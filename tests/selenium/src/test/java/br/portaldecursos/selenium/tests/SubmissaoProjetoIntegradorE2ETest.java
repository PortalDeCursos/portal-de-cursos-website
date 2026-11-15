package br.portaldecursos.selenium.tests;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import br.portaldecursos.selenium.pages.Seletores;
import java.nio.file.Path;
import java.time.Instant;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class SubmissaoProjetoIntegradorE2ETest extends BaseE2ETest {
  private String tituloCriado;

  @Test
  @Order(1)
  @DisplayName("RN01 - aluno autenticado acessa a tela de submissão")
  void alunoAutenticadoAcessaSubmissao() {
    submissao.abrir();
    assertTrue(navegador.getCurrentUrl().endsWith(configuracao.obrigatorio("rota.submissao")));
    assertTrue(navegador.findElement(Seletores.FORMULARIO_SUBMISSAO).isDisplayed());
    assertFalse(navegador.getCurrentUrl().contains(configuracao.obrigatorio("rota.login")));
  }

  @Test
  @Order(2)
  @DisplayName("RN02 - curso, orientador e disciplina vêm dos serviços reais")
  void carregaOpcoesAcademicasDasApis() {
    submissao.abrir();
    assertTrue(submissao.quantidadeCursosDisponiveis() > 0, "A API não carregou cursos.");
    assertFalse(submissao.cursoSelecionado().isBlank(), "O perfil do aluno não tem curso selecionado.");

    preencherEtapaProjeto("Validação de opções Selenium");
    submissao.irParaEquipe();
    assertTrue(submissao.quantidadeOrientadoresDisponiveis() > 0,
        "A API não carregou orientadores para o curso do aluno.");
    submissao.selecionarOrientadorDaApi();
    assertTrue(submissao.quantidadeDisciplinasDisponiveis() > 0,
        "A API não carregou disciplinas para o curso do aluno.");
    submissao.selecionarDisciplinaDaApi();
  }

  @Test
  @Order(3)
  @DisplayName("RN03 - título vazio é bloqueado antes do envio")
  void bloqueiaTituloVazio() {
    submissao.abrir();
    preencherEtapaProjeto("");
    submissao.continuar();
    assertTrue(submissao.tituloMarcadoInvalido());
    assertTrue(submissao.erroDoTitulo().contains("Informe título."));
    assertFalse(submissao.confirmacaoVisivel());
  }

  @Test
  @Order(4)
  @DisplayName("RN04 - título formado por espaços é bloqueado")
  void bloqueiaTituloComEspacos() {
    submissao.abrir();
    preencherEtapaProjeto("   \t   ");
    submissao.continuar();
    assertTrue(submissao.tituloMarcadoInvalido());
    assertTrue(submissao.erroDoTitulo().contains("Informe título."));
    assertFalse(submissao.confirmacaoVisivel());
  }

  @Test
  @Order(5)
  @DisplayName("RN05 - título acima do limite de 255 caracteres é rejeitado")
  void rejeitaTituloAcimaDoLimite(@TempDir Path diretorioTemporario) {
    submissao.abrir();
    preencherFluxoAteDocumentos("A".repeat(256));
    anexarEAutorizar(diretorioTemporario);
    submissao.enviar();
    assertFalse(submissao.confirmacaoVisivel());
    String mensagem = submissao.mensagemErro().toLowerCase(java.util.Locale.ROOT);
    assertTrue(mensagem.contains("nome") || mensagem.contains("255") || mensagem.contains("tamanho"),
        "O backend não indicou a regra real de tamanho do nome: " + mensagem);
  }

  @Test
  @Order(6)
  @DisplayName("RN08 - envio sem os PDFs obrigatórios é bloqueado")
  void bloqueiaEnvioSemDocumentos() {
    submissao.abrir();
    preencherFluxoAteDocumentos("Teste de obrigatoriedade de documentos " + Instant.now().toEpochMilli());
    submissao.autorizarPublicacao();
    submissao.enviar();
    assertFalse(submissao.confirmacaoVisivel());
    assertTrue(submissao.mensagemErro().contains("Anexe os documentos obrigatórios"));
  }

  @Test
  @Order(7)
  @DisplayName("RN06 - submissão com os dois PDFs é gravada pelos serviços reais")
  void enviaProjetoIntegradorComDocumentos(@TempDir Path diretorioTemporario) {
    tituloCriado = "Teste Selenium Projeto Integrador " + Instant.now().toEpochMilli();
    submissao.abrir();
    preencherFluxoAteDocumentos(tituloCriado);
    anexarEAutorizar(diretorioTemporario);
    submissao.enviar();
    assertTrue(submissao.confirmacaoVisivel(), "A confirmação de envio não apareceu.");
  }

  @Test
  @Order(8)
  @DisplayName("RN07 - título duplicado é rejeitado pelo backend")
  void rejeitaProjetoComTituloDuplicado(@TempDir Path diretorioTemporario) {
    assertNotNull(tituloCriado, "RN06 precisa gravar o primeiro projeto antes deste cenário.");
    submissao.abrirOutroProjeto();
    preencherFluxoAteDocumentos(tituloCriado);
    anexarEAutorizar(diretorioTemporario);
    submissao.enviar();
    assertFalse(submissao.confirmacaoVisivel());
    assertTrue(submissao.mensagemErro().toLowerCase(java.util.Locale.ROOT).contains("existe"),
        "A mensagem não confirmou a rejeição por nome duplicado.");
  }

  private void preencherFluxoAteDocumentos(String titulo) {
    preencherEtapaProjeto(titulo);
    submissao.continuarAte(Seletores.ORIENTADOR);
    submissao.selecionarOrientadorDaApi();
    submissao.selecionarDisciplinaDaApi();
    submissao.continuarAte(Seletores.DOCUMENTOS_TITULO);
  }

  private void preencherEtapaProjeto(String titulo) {
    submissao.irParaProjeto();
    submissao.preencherProjeto(titulo);
  }

  private void anexarEAutorizar(Path diretorioTemporario) {
    submissao.anexarDocumentos(diretorioTemporario);
    submissao.autorizarPublicacao();
  }
}
