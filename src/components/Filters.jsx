
import { Search, FilterX } from "lucide-react";

export default function Filters({ f }) {
  const filtrosAtivos =
    f.busca.trim() !== "" ||
    f.gravidade !== "Todas" ||
    f.status !== "Todos";

  const limpar = () => {
    if (f.limparFiltros) {
      f.limparFiltros();
    } else {
      f.setBusca("");
      f.setGravidade("Todas");
      f.setStatus("Todos");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-5">

      {/* BUSCA */}
      <label className="relative flex-1">
        <Search
          size={17}
          className="absolute left-3 top-3.5 text-slate-500"
        />

        <input
          type="search"
          className="field !pl-10"
          value={f.busca}
          onChange={(e) => f.setBusca(e.target.value)}
          placeholder="Buscar título, endereço, tipo ou descrição..."
          aria-label="Buscar ocorrências"
        />
      </label>

      {/* GRAVIDADE */}
      <select
        className="field md:!w-44"
        aria-label="Filtrar por gravidade"
        value={f.gravidade}
        onChange={(e) => f.setGravidade(e.target.value)}
      >
        <option value="Todas">
          Todas as gravidades
        </option>

        <option value="Baixa">
          Baixa
        </option>

        <option value="Media">
          Média
        </option>

        <option value="Alta">
          Alta
        </option>
      </select>

      {/* STATUS */}
      <select
        className="field md:!w-44"
        aria-label="Filtrar por status"
        value={f.status}
        onChange={(e) => f.setStatus(e.target.value)}
      >
        <option value="Todos">
          Todos os status
        </option>

        <option value="Pendente">
          Pendente
        </option>

        <option value="Em analise">
          Em análise
        </option>

        <option value="Resolvido">
          Resolvido
        </option>
      </select>

      {/* LIMPAR FILTROS */}
      <button
        type="button"
        onClick={limpar}
        disabled={!filtrosAtivos}
        className="ghost flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Limpar filtros"
      >
        <FilterX size={17} />
        Limpar
      </button>
    </div>
  );
}
