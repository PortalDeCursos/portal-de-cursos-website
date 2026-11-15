package br.portaldecursos.selenium.support;

import br.portaldecursos.selenium.config.ConfiguracaoTeste;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;

public final class NavegadorFactory {
  private NavegadorFactory() {}

  public static WebDriver criar(ConfiguracaoTeste configuracao) {
    ChromeOptions opcoes = new ChromeOptions();
    String executavel = configuracao.obter("navegador.executavel");
    if (executavel.isBlank()) executavel = detectarNavegador();
    if (!executavel.isBlank()) opcoes.setBinary(executavel);

    Map<String, Object> preferencias = new HashMap<>();
    preferencias.put("credentials_enable_service", false);
    preferencias.put("profile.password_manager_enabled", false);
    preferencias.put("profile.default_content_setting_values.notifications", 2);
    opcoes.setExperimentalOption("prefs", preferencias);
    opcoes.addArguments(
        "--disable-save-password-bubble",
        "--disable-features=PasswordManagerOnboarding,PasswordLeakDetection",
        "--disable-crash-reporter",
        "--disable-breakpad",
        "--user-data-dir=" + Path.of(System.getProperty("java.io.tmpdir"),
            "portal-selenium-" + java.util.UUID.randomUUID()).toAbsolutePath());
    if (configuracao.booleano("headless")) opcoes.addArguments("--headless=new");

    String caminhoDriver = configuracao.obter("navegador.driver");
    WebDriver navegador;
    if (caminhoDriver.isBlank()) {
      navegador = new org.openqa.selenium.chrome.ChromeDriver(opcoes);
    } else {
      ChromeDriverService servico = new ChromeDriverService.Builder()
          .usingDriverExecutable(Path.of(caminhoDriver).toFile())
          .build();
      navegador = new org.openqa.selenium.chrome.ChromeDriver(servico, opcoes);
    }
    navegador.manage().window().setSize(new Dimension(1440, 1100));
    navegador.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
    navegador.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
    return navegador;
  }

  private static String detectarNavegador() {
    for (Path caminho : caminhosBrave()) {
      if (Files.isRegularFile(caminho)) return caminho.toString();
    }
    for (Path caminho : caminhosChrome()) {
      if (Files.isRegularFile(caminho)) return caminho.toString();
    }
    return "";
  }

  private static java.util.List<Path> caminhosBrave() {
    String sistema = System.getProperty("os.name", "").toLowerCase(java.util.Locale.ROOT);
    Path home = Path.of(System.getProperty("user.home"));
    if (sistema.contains("win")) {
      java.util.List<Path> caminhos = new java.util.ArrayList<>();
      adicionarSeDefinido(caminhos, System.getenv("ProgramFiles"), "BraveSoftware/Brave-Browser/Application/brave.exe");
      adicionarSeDefinido(caminhos, System.getenv("ProgramFiles(x86)"), "BraveSoftware/Brave-Browser/Application/brave.exe");
      adicionarSeDefinido(caminhos, System.getenv("LOCALAPPDATA"), "BraveSoftware/Brave-Browser/Application/brave.exe");
      return caminhos;
    }
    if (sistema.contains("mac")) {
      return java.util.List.of(
          Path.of("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"),
          home.resolve("Applications/Brave Browser.app/Contents/MacOS/Brave Browser"));
    }
    return java.util.List.of(Path.of("/usr/bin/brave-browser"), Path.of("/usr/bin/brave"),
        Path.of("/snap/bin/brave"));
  }

  private static java.util.List<Path> caminhosChrome() {
    String sistema = System.getProperty("os.name", "").toLowerCase(java.util.Locale.ROOT);
    Path home = Path.of(System.getProperty("user.home"));
    if (sistema.contains("win")) {
      java.util.List<Path> caminhos = new java.util.ArrayList<>();
      adicionarSeDefinido(caminhos, System.getenv("ProgramFiles"), "Google/Chrome/Application/chrome.exe");
      adicionarSeDefinido(caminhos, System.getenv("ProgramFiles(x86)"), "Google/Chrome/Application/chrome.exe");
      adicionarSeDefinido(caminhos, System.getenv("LOCALAPPDATA"), "Google/Chrome/Application/chrome.exe");
      return caminhos;
    }
    if (sistema.contains("mac")) {
      return java.util.List.of(Path.of("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
          home.resolve("Applications/Google Chrome.app/Contents/MacOS/Google Chrome"));
    }
    return java.util.List.of(Path.of("/usr/bin/google-chrome"), Path.of("/usr/bin/chromium"),
        Path.of("/usr/bin/chromium-browser"));
  }

  private static void adicionarSeDefinido(java.util.List<Path> caminhos, String base, String relativo) {
    if (base != null && !base.isBlank()) caminhos.add(Path.of(base).resolve(relativo));
  }
}
