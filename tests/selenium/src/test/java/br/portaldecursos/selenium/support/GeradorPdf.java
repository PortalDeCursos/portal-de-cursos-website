package br.portaldecursos.selenium.support;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public final class GeradorPdf {
  private GeradorPdf() {}

  public static Path criar(Path diretorioTemporario, String nome) throws IOException {
    Files.createDirectories(diretorioTemporario);
    ByteArrayOutputStream pdf = new ByteArrayOutputStream();
    List<Integer> offsets = new ArrayList<>();
    escrever(pdf, "%PDF-1.4\n% Portal de Cursos Selenium\n");
    objeto(pdf, offsets, "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    objeto(pdf, offsets, "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    objeto(pdf, offsets,
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] "
            + "/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n");
    byte[] conteudo = "BT /F1 12 Tf 24 100 Td (Documento de teste Selenium) Tj ET"
        .getBytes(StandardCharsets.US_ASCII);
    offsets.add(pdf.size());
    escrever(pdf, "4 0 obj\n<< /Length " + conteudo.length + " >>\nstream\n");
    pdf.write(conteudo);
    escrever(pdf, "\nendstream\nendobj\n");
    objeto(pdf, offsets, "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

    int inicioXref = pdf.size();
    escrever(pdf, "xref\n0 6\n0000000000 65535 f \n");
    for (int offset : offsets) escrever(pdf, String.format("%010d 00000 n \n", offset));
    escrever(pdf, "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + inicioXref + "\n%%EOF\n");

    Path arquivo = diretorioTemporario.resolve(nome);
    Files.write(arquivo, pdf.toByteArray());
    return arquivo;
  }

  private static void objeto(ByteArrayOutputStream pdf, List<Integer> offsets, String conteudo)
      throws IOException {
    offsets.add(pdf.size());
    escrever(pdf, conteudo);
  }

  private static void escrever(ByteArrayOutputStream pdf, String conteudo) throws IOException {
    pdf.write(conteudo.getBytes(StandardCharsets.US_ASCII));
  }
}
