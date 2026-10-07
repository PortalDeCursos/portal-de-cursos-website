export default function SectionState({
  kind,
}: {
  kind: "cursos" | "projetos";
}) {
  return (
    <div className="section-feedback" role="status">
      <h3>Nenhum item disponível</h3>
      <p>Novos {kind} serão exibidos aqui quando estiverem disponíveis.</p>
    </div>
  );
}
