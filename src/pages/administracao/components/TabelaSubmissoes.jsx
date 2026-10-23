export default function TabelaSubmissoes({ itens, baseDetalhes }) {
  return (
    <div className="tabela-submissoes" role="region" aria-label="Lista de submissões" tabIndex={0}>
      <table>
        <caption className="somente-leitores">Acompanhamento de submissões acadêmicas</caption>
        <thead>
          <tr>
            <th scope="col">Projeto</th>
            <th scope="col">Curso</th>
            <th scope="col">Envio</th>
            <th scope="col">Situação</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.identificador}>
              <th scope="row">
                {baseDetalhes ? (
                  <a href={`${baseDetalhes}/${encodeURIComponent(item.identificador)}`}>
                    {item.titulo}
                  </a>
                ) : (
                  item.titulo
                )}
                <span>
                  {item.autor} · {item.tipo}
                </span>
              </th>
              <td>{item.curso}</td>
              <td>{item.enviadoEm}</td>
              <td>
                <span className={`status status--${item.status.toLowerCase().replace(' ', '-')}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
