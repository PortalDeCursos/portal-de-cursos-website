import Button from "../components/ui/Button";
export default function NotFoundPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Página não encontrada</h1>
      <p className="my-6 text-muted">
        Este endereço não corresponde a um curso ou projeto disponível.
      </p>
      <Button to="/cursos">Voltar ao catálogo</Button>
    </div>
  );
}
