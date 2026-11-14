package br.portaldecursos.selenium.support;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.Supplier;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public final class ScreenshotEmFalha implements TestWatcher {
  private final Supplier<WebDriver> fornecerNavegador;

  public ScreenshotEmFalha(Supplier<WebDriver> fornecerNavegador) {
    this.fornecerNavegador = fornecerNavegador;
  }

  @Override
  public void testFailed(ExtensionContext contexto, Throwable falha) {
    WebDriver navegador = fornecerNavegador.get();
    if (!(navegador instanceof TakesScreenshot captura)) return;

    try {
      Path diretorio = Path.of("target", "screenshots");
      Files.createDirectories(diretorio);
      String horario = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
      String nome = contexto.getDisplayName().replaceAll("[^a-zA-Z0-9.-]", "_");
      Path arquivo = diretorio.resolve(nome + "-" + horario + ".png");
      Files.copy(captura.getScreenshotAs(OutputType.FILE).toPath(), arquivo);
      contexto.publishReportEntry("Screenshot", arquivo.toAbsolutePath().toString());
    } catch (Exception falhaNaCaptura) {
      contexto.publishReportEntry("Screenshot não capturada: "
          + falhaNaCaptura.getClass().getSimpleName());
    }
  }
}
