package br.portaldecursos.selenium.config;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

public final class ConfiguracaoTeste {
  private final Properties valores = new Properties();

  public ConfiguracaoTeste() {
    try (InputStream padroes = getClass().getClassLoader()
        .getResourceAsStream("selenium.defaults.properties")) {
      if (padroes == null) {
        throw new IllegalStateException("selenium.defaults.properties não está no classpath de testes.");
      }
      valores.load(padroes);
    } catch (IOException falha) {
      throw new IllegalStateException("Não foi possível carregar selenium.defaults.properties.", falha);
    }

    Path arquivoLocal = Path.of("selenium.local.properties");
    if (Files.exists(arquivoLocal)) {
      try (Reader leitor = Files.newBufferedReader(arquivoLocal)) {
        Properties locais = new Properties();
        locais.load(leitor);
        valores.putAll(locais);
      } catch (IOException falha) {
        throw new IllegalStateException("Não foi possível ler selenium.local.properties.", falha);
      }
    }
  }

  public String obter(String chave) {
    String argumento = System.getProperty(chave);
    if (argumento != null) return argumento.trim();
    return valores.getProperty(chave, "").trim();
  }

  public String obrigatorio(String chave) {
    String valor = obter(chave);
    if (valor.isBlank()) {
      throw new IllegalStateException("A propriedade '" + chave + "' não pode ficar vazia.");
    }
    return valor;
  }

  public boolean booleano(String chave) {
    return Boolean.parseBoolean(obter(chave));
  }

  public int inteiro(String chave) {
    try {
      return Integer.parseInt(obter(chave));
    } catch (NumberFormatException falha) {
      throw new IllegalStateException("A propriedade '" + chave + "' deve ser um número inteiro.", falha);
    }
  }
}
