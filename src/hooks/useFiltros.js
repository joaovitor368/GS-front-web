
import { useMemo, useState } from "react";

// Normaliza textos para facilitar a pesquisa
function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function useFiltros(items = []) {
  const [busca, setBusca] = useState("");
  const [gravidade, setGravidade] = useState("Todas");
  const [status, setStatus] = useState("Todos");

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);

    return items.filter((item) => {
      // Pesquisa por título, endereço, tipo e descrição
      const camposPesquisa = [
        item.titulo,
        item.endereco,
        item.tipo,
        item.descricao
      ];

      const correspondeBusca =
        !termo ||
        camposPesquisa.some((campo) =>
          normalizarTexto(campo).includes(termo)
        );

      // Filtro por gravidade
      const correspondeGravidade =
        gravidade === "Todas" ||
        normalizarTexto(item.gravidade) ===
          normalizarTexto(gravidade);

      // Filtro por status
      const correspondeStatus =
        status === "Todos" ||
        normalizarTexto(item.status) ===
          normalizarTexto(status);

      return (
        correspondeBusca &&
        correspondeGravidade &&
        correspondeStatus
      );
    });
  }, [items, busca, gravidade, status]);

  // Limpar todos os filtros
  const limparFiltros = () => {
    setBusca("");
    setGravidade("Todas");
    setStatus("Todos");
  };

  return {
    busca,
    setBusca,
    gravidade,
    setGravidade,
    status,
    setStatus,
    filtrados,
    limparFiltros
  };
}
