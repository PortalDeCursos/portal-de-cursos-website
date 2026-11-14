package br.portaldecursos.selenium.support;

import br.portaldecursos.selenium.config.ConfiguracaoTeste;
import java.net.URI;

public final class ProtecaoAmbiente {
  private ProtecaoAmbiente() {}

  public static URI validarPortal(ConfiguracaoTeste configuracao) {
    URI uri;
    try {
      uri = URI.create(configuracao.obrigatorio("portal.url"));
    } catch (IllegalArgumentException falha) {
      throw new IllegalStateException("portal.url não é uma URL válida.", falha);
    }

    String protocolo = uri.getScheme();
    String host = uri.getHost();
    if (host == null || !("http".equalsIgnoreCase(protocolo) || "https".equalsIgnoreCase(protocolo))) {
      throw new IllegalStateException("portal.url precisa usar http(s) e informar um host.");
    }

    if (!configuracao.booleano("permitir.ambiente.remoto") && !hostLocalOuPrivado(host)) {
      throw new IllegalStateException(
          "Execução bloqueada: portal.url deve apontar para localhost, 127.0.0.1 ou uma rede privada. "
              + "Use -Dpermitir.ambiente.remoto=true apenas se a execução remota foi autorizada.");
    }
    return uri;
  }

  private static boolean hostLocalOuPrivado(String hostOriginal) {
    String host = hostOriginal.toLowerCase(java.util.Locale.ROOT);
    if (host.equals("localhost") || host.equals("127.0.0.1") || host.equals("::1")) return true;

    String[] octetos = host.split("\\.");
    if (octetos.length != 4) return false;
    try {
      int primeiro = Integer.parseInt(octetos[0]);
      int segundo = Integer.parseInt(octetos[1]);
      int terceiro = Integer.parseInt(octetos[2]);
      int quarto = Integer.parseInt(octetos[3]);
      if (java.util.Arrays.stream(octetos).anyMatch(octeto -> octeto.length() > 3)) return false;
      if (primeiro < 0 || primeiro > 255 || segundo < 0 || segundo > 255
          || terceiro < 0 || terceiro > 255 || quarto < 0 || quarto > 255) return false;
      return primeiro == 10
          || (primeiro == 192 && segundo == 168)
          || (primeiro == 172 && segundo >= 16 && segundo <= 31);
    } catch (NumberFormatException falha) {
      return false;
    }
  }
}
