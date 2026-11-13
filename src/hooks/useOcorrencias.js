
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const CAMPOS_PERMITIDOS = [
  "titulo",
  "descricao",
  "endereco",
  "tipo",
  "gravidade",
  "status",
  "latitude",
  "longitude"
];

function prepararDados(dados) {
  const resultado = {};

  // Aceita os nomes antigos do formulário
  const entrada = {
    ...dados,
    endereco: dados.endereco ?? dados.local,
    tipo: dados.tipo ?? dados.categoria
  };

  for (const campo of CAMPOS_PERMITIDOS) {
    if (
      entrada[campo] !== undefined &&
      entrada[campo] !== null
    ) {
      resultado[campo] = entrada[campo];
    }
  }

  // Valores padrão
  if (!resultado.status) {
    resultado.status = "Pendente";
  }

  if (!resultado.gravidade) {
    resultado.gravidade = "Media";
  }

  return resultado;
}

export function useOcorrencias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar ocorrências no Supabase
  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: erro } = await supabase
        .from("ocorrencias")
        .select("*")
        .order("criado_em", {
          ascending: false
        });

      if (erro) throw erro;

      setItems(data ?? []);
      return data ?? [];

    } catch (erro) {
      console.error("Erro ao carregar:", erro);
      setError(erro.message);
      return [];

    } finally {
      setLoading(false);
    }
  }, []);

  // Carregamento inicial e atualização em tempo real
  useEffect(() => {
    carregar();

    const canal = supabase
      .channel("urbansense-tempo-real")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ocorrencias"
        },
        () => {
          carregar();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [carregar]);

  // Cadastrar ocorrência
  const criar = async (dados) => {
    try {
      setError(null);

      const {
        data: { user },
        error: erroAuth
      } = await supabase.auth.getUser();

      if (erroAuth) throw erroAuth;

      if (!user) {
        throw new Error(
          "Faça login antes de cadastrar uma ocorrência."
        );
      }

      const novaOcorrencia = {
        ...prepararDados(dados),
        usuario_id: user.id
      };

      const { error: erro } = await supabase
        .from("ocorrencias")
        .insert(novaOcorrencia);

      if (erro) throw erro;

      await carregar();
      return true;

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      setError(erro.message);
      return false;
    }
  };

  // Editar ocorrência
  const atualizar = async (id, dados) => {
    try {
      setError(null);

      const {
        data: { user },
        error: erroAuth
      } = await supabase.auth.getUser();

      if (erroAuth) throw erroAuth;

      if (!user) {
        throw new Error("Faça login para editar.");
      }

      const campos = prepararDados(dados);

      const { data, error: erro } = await supabase
        .from("ocorrencias")
        .update(campos)
        .eq("id", id)
        .eq("usuario_id", user.id)
        .select("id");

      if (erro) throw erro;

      if (!data?.length) {
        throw new Error(
          "Ocorrência não encontrada ou sem permissão."
        );
      }

      await carregar();
      return true;

    } catch (erro) {
      console.error("Erro ao atualizar:", erro);
      setError(erro.message);
      return false;
    }
  };

  // Excluir ocorrência
  const excluir = async (id) => {
    try {
      setError(null);

      const {
        data: { user },
        error: erroAuth
      } = await supabase.auth.getUser();

      if (erroAuth) throw erroAuth;

      if (!user) {
        throw new Error("Faça login para excluir.");
      }

      const { data, error: erro } = await supabase
        .from("ocorrencias")
        .delete()
        .eq("id", id)
        .eq("usuario_id", user.id)
        .select("id");

      if (erro) throw erro;

      if (!data?.length) {
        throw new Error(
          "Ocorrência não encontrada ou sem permissão."
        );
      }

      await carregar();
      return true;

    } catch (erro) {
      console.error("Erro ao excluir:", erro);
      setError(erro.message);
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    carregar,
    criar,
    atualizar,
    excluir
  };
}
