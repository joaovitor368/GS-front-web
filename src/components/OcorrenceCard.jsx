
import {
  MapPin,
  Pencil,
  Trash2,
  CalendarDays,
  LockKeyhole
} from "lucide-react";

import SeverityBadge from "./SeverityBadge";

export default function OcorrenceCard({
  item,
  onEdit,
  onDelete,
  usuarioId
}) {
  if (!item) return null;

  // Apenas o autor pode editar ou excluir
  const podeGerenciar =
    Boolean(usuarioId) &&
    item.usuario_id === usuarioId;

  // Formatar status para exibição
  const formatarStatus = (status) => {
    const nomes = {
      Pendente: "Pendente",
      "Em analise": "Em análise",
      Resolvido: "Resolvido"
    };

    return nomes[status] || status || "Não informado";
  };

  // Formatar data do Supabase
  const formatarData = (data) => {
    if (!data) return "Data não informada";

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
      return "Data não informada";
    }

    return valor.toLocaleDateString("pt-BR");
  };

  return (
    <article className="glass rounded-2xl p-5 flex flex-col gap-3">
      {/* TIPO, TÍTULO E GRAVIDADE */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="text-xs text-teal-300 font-semibold mb-2">
            {item.tipo || "Não informado"}
          </div>

          <h3 className="font-bold text-white break-words">
            {item.titulo}
          </h3>
        </div>

        <SeverityBadge value={item.gravidade} />
      </div>

      {/* ENDEREÇO */}
      <p className="text-sm text-slate-400 flex gap-2 items-start">
        <MapPin
          size={15}
          className="shrink-0 mt-0.5 text-teal-300"
        />

        <span className="break-words">
          {item.endereco || "Endereço não informado"}
        </span>
      </p>

      {/* DESCRIÇÃO */}
      <p className="text-sm text-slate-400 flex-1 whitespace-pre-wrap break-words">
        {item.descricao || "Sem descrição"}
      </p>

      {/* DATA */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={14} />

        <span>
          Registrado em {formatarData(item.criado_em)}
        </span>
      </div>

      {/* STATUS E AÇÕES */}
      <div className="border-t border-slate-700/70 pt-3 flex justify-between items-center gap-3">
        <span className="text-xs text-slate-300">
          {formatarStatus(item.status)}
        </span>

        {podeGerenciar ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              aria-label={`Editar ${item.titulo}`}
              title="Editar ocorrência"
              className="ghost !p-2"
            >
              <Pencil size={15} />
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(item)}
              aria-label={`Excluir ${item.titulo}`}
              title="Excluir ocorrência"
              className="ghost !p-2 hover:text-red-300"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : (
          <span
            className="flex items-center gap-1 text-xs text-slate-500"
            title="Somente o autor pode editar ou excluir"
          >
            <LockKeyhole size={13} />
            Somente leitura
          </span>
        )}
      </div>
    </article>
  );
}
