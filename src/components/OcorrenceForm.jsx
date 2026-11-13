
import { useEffect, useState } from "react";
import { X, MapPin, AlertTriangle, Save } from "lucide-react";

const formularioVazio = {
  titulo: "",
  tipo: "Pavimento",
  endereco: "",
  gravidade: "Media",
  status: "Pendente",
  descricao: ""
};

export default function OcorrenceForm({
  item,
  onSave,
  onClose
}) {
  const [form, setForm] = useState(formularioVazio);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (item) {
      setForm({
        titulo: item.titulo ?? "",
        tipo: item.tipo ?? "Pavimento",
        endereco: item.endereco ?? item.local ?? "",
        gravidade:
          item.gravidade === "Média"
            ? "Media"
            : item.gravidade ?? "Media",
        status:
          item.status === "Em análise"
            ? "Em analise"
            : item.status ?? "Pendente",
        descricao: item.descricao ?? ""
      });
    } else {
      setForm({ ...formularioVazio });
    }

    setErro("");
  }, [item]);

  const update = (campo, valor) => {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.titulo.trim() ||
      !form.endereco.trim() ||
      !form.descricao.trim()
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    setErro("");

    try {
      const dados = {
        titulo: form.titulo.trim(),
        tipo: form.tipo,
        endereco: form.endereco.trim(),
        gravidade: form.gravidade,
        status: form.status,
        descricao: form.descricao.trim()
      };

      const ok = await onSave(dados);

      if (ok) {
        onClose();
      } else {
        setErro(
          "Não foi possível salvar. Verifique a conexão e as permissões do Supabase."
        );
      }
    } catch (erro) {
      console.error("Erro ao salvar ocorrência:", erro);

      setErro(
        erro.message || "Erro inesperado ao salvar."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-600 bg-[#102037] p-6"
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2
              id="form-title"
              className="heading text-xl font-bold text-white"
            >
              {item
                ? "Editar ocorrência"
                : "Cadastrar ocorrência"}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              UrbanSense — Gestão de acessibilidade
            </p>
          </div>

          <button
            type="button"
            aria-label="Fechar formulário"
            onClick={onClose}
            disabled={saving}
            className="text-slate-300 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            Título da ocorrência

            <input
              required
              maxLength={120}
              className="field mt-1.5"
              placeholder="Ex.: Calçada danificada"
              value={form.titulo}
              onChange={(e) =>
                update("titulo", e.target.value)
              }
            />
          </label>

          <label className="block text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Endereço ou localização
            </span>

            <input
              required
              className="field mt-1.5"
              placeholder="Ex.: Avenida Paulista, São Paulo"
              value={form.endereco}
              onChange={(e) =>
                update("endereco", e.target.value)
              }
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-sm text-slate-300">
              Tipo

              <select
                className="field mt-1.5"
                value={form.tipo}
                onChange={(e) =>
                  update("tipo", e.target.value)
                }
              >
                <option value="Pavimento">
                  Pavimento
                </option>

                <option value="Acesso">
                  Acesso
                </option>

                <option value="Iluminação">
                  Iluminação
                </option>

                <option value="Sinalização">
                  Sinalização
                </option>

                <option value="Outros">
                  Outros
                </option>
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Gravidade

              <select
                className="field mt-1.5"
                value={form.gravidade}
                onChange={(e) =>
                  update("gravidade", e.target.value)
                }
              >
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
            </label>

            <label className="text-sm text-slate-300">
              Status

              <select
                className="field mt-1.5"
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value)
                }
              >
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
            </label>
          </div>

          <label className="block text-sm text-slate-300">
            Descrição

            <textarea
              required
              maxLength={500}
              rows={4}
              className="field mt-1.5"
              placeholder="Descreva o problema encontrado..."
              value={form.descricao}
              onChange={(e) =>
                update("descricao", e.target.value)
              }
            />
          </label>

          <div className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <AlertTriangle
              size={18}
              className="text-amber-300 shrink-0"
            />

            <p className="text-xs text-amber-200">
              Informe apenas situações verificadas.
              Para testes, identifique claramente os
              registros como demonstrativos.
            </p>
          </div>

          {erro && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="ghost"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="action flex items-center gap-2"
            >
              <Save size={17} />

              {saving
                ? "Salvando..."
                : item
                  ? "Salvar alterações"
                  : "Cadastrar ocorrência"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
