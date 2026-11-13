
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Plus,
  RefreshCw,
  RadioTower,
  MapPin,
  ExternalLink
} from "lucide-react";

// COMPONENTES
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatCard from "./components/StatCard";
import OcorrenceCard from "./components/OcorrenceCard";
import OcorrenceForm from "./components/OcorrenceForm";
import Filters from "./components/Filters";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";
import AuthPanel from "./components/AuthPanel";

// HOOKS PERSONALIZADOS
import { useOcorrencias } from "./hooks/useOcorrencias";
import { useFiltros } from "./hooks/useFiltros";

export default function App() {
  // ESTADOS PRINCIPAIS
  const [page, setPage] = useState("painel");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // SUPABASE E FILTROS
  const api = useOcorrencias();
  const filtros = useFiltros(api.items);

  // AUTENTICAÇÃO SUPABASE
  useEffect(() => {
    let ativo = true;

    async function verificarUsuario() {
      const { data, error } = await supabase.auth.getUser();

      if (!ativo) return;

      if (error) {
        console.error("Erro ao verificar autenticação:", error);
      }

      setUser(data?.user ?? null);
      setAuthLoading(false);
    }

    verificarUsuario();

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!ativo) return;

        setUser(session?.user ?? null);
        setAuthLoading(false);
      });

    return () => {
      ativo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // INDICADOR DO HEADER
  // Representa o sucesso da consulta de ocorrências,
  // não uma verificação contínua da conexão de rede.
  const conectado = !api.loading && !api.error;

  // ABRIR FORMULÁRIO PARA NOVA OCORRÊNCIA
  const abrirNovo = () => {
    if (!user) {
      setNotice("Faça login para cadastrar uma ocorrência.");
      return;
    }

    setEditing(null);
    setNotice("");
    setModal(true);
  };

  // EDITAR OCORRÊNCIA
  const editar = (item) => {
    if (!user || item.usuario_id !== user.id) {
      setNotice("Você só pode editar suas próprias ocorrências.");
      return;
    }

    setEditing(item);
    setNotice("");
    setModal(true);
  };

  // SALVAR NO SUPABASE
  const salvar = async (dados) => {
    if (!user) {
      setNotice("Faça login para salvar uma ocorrência.");
      return false;
    }

    if (editing && editing.usuario_id !== user.id) {
      setNotice("Você não pode alterar esta ocorrência.");
      return false;
    }

    const ok = editing
      ? await api.atualizar(editing.id, dados)
      : await api.criar(dados);

    if (ok) {
      setNotice(
        editing
          ? "Ocorrência atualizada com sucesso no Supabase."
          : "Ocorrência cadastrada com sucesso no Supabase."
      );
    }

    return ok;
  };

  // EXCLUIR OCORRÊNCIA
  const excluir = async (item) => {
    if (!user || item.usuario_id !== user.id) {
      setNotice("Você só pode excluir suas próprias ocorrências.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir a ocorrência "${item.titulo}"?`
    );

    if (!confirmar) return;

    const ok = await api.excluir(item.id);

    if (ok) {
      setNotice("Ocorrência excluída com sucesso.");
    }
  };

  // INDICADORES CALCULADOS COM OS DADOS DO SUPABASE
  const total = api.items.length;

  const graves = api.items.filter(
    (item) => item.gravidade === "Alta"
  ).length;

  const resolvidas = api.items.filter(
    (item) => item.status === "Resolvido"
  ).length;

  const pendentes = api.items.filter(
    (item) => item.status === "Pendente"
  ).length;

  return (
    <div className="min-h-screen lg:flex">
      {/* MENU LATERAL */}
      <Sidebar
        page={page}
        setPage={setPage}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">

        {/* HEADER COM STATUS DO SUPABASE */}
        <Header
          page={page}
          conectado={conectado}
        />

        {/* AUTENTICAÇÃO */}
        {authLoading ? (
          <p className="text-slate-400 mb-4">
            Verificando autenticação...
          </p>
        ) : (
          <AuthPanel user={user} />
        )}

        {/* NOTIFICAÇÕES */}
        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl bg-teal-400/10 border border-teal-400/30 px-4 py-3 text-teal-200 text-sm flex justify-between gap-4"
          >
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="shrink-0"
            >
              Fechar
            </button>
          </div>
        )}

        {/* ERROS DO SUPABASE */}
        {api.error && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-red-500/10 border border-red-500/40 p-4 text-red-200 text-sm"
          >
            <span>{String(api.error)}</span>

            <button
              type="button"
              onClick={api.carregar}
              className="underline ml-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* VISÃO GERAL */}
        {page === "painel" && (
          <>
            <Hero
              onOpen={() => setPage("ocorrencias")}
            />

            {/* CARDS DE ESTATÍSTICAS */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

              <StatCard
                label="Ocorrências"
                value={total}
                sub="Registros no Supabase"
                Icon={ClipboardList}
              />

              <StatCard
                label="Alta gravidade"
                value={graves}
                sub="Ocorrências de alta gravidade"
                Icon={AlertTriangle}
                accent="text-orange-300"
              />

              <StatCard
                label="Resolvidas"
                value={resolvidas}
                sub="Registros marcados como resolvidos"
                Icon={CheckCircle2}
              />

              <StatCard
                label="Pendentes"
                value={pendentes}
                sub="Aguardando análise"
                Icon={ClipboardList}
                accent="text-sky-300"
              />

            </div>

            <div className="grid xl:grid-cols-5 gap-5">

              {/* OCORRÊNCIAS RECENTES */}
              <section className="glass rounded-2xl p-6 xl:col-span-3">

                <div className="flex items-center justify-between mb-5">
                  <h2 className="heading text-xl font-bold text-white">
                    Ocorrências recentes
                  </h2>

                  <button
                    type="button"
                    onClick={() => setPage("ocorrencias")}
                    className="text-sm text-teal-300"
                  >
                    Ver todas →
                  </button>
                </div>

                {api.loading ? (
                  <p className="text-slate-400">
                    Carregando ocorrências...
                  </p>
                ) : api.error ? (
                  <p className="text-red-300 text-sm">
                    Não foi possível carregar os registros.
                  </p>
                ) : api.items.length > 0 ? (
                  <div className="space-y-3">

                    {api.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-slate-700/60 pb-3 flex justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-white font-semibold break-words">
                            {item.titulo}
                          </div>

                          <div className="text-xs text-slate-400 mt-1 break-words">
                            {item.endereco || "Endereço não informado"}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            {item.tipo} ·{" "}
                            {item.gravidade === "Media"
                              ? "Média"
                              : item.gravidade}
                          </div>
                        </div>

                        <span className="text-xs text-teal-300 shrink-0">
                          {item.status === "Em analise"
                            ? "Em análise"
                            : item.status}
                        </span>
                      </div>
                    ))}

                  </div>
                ) : (
                  <EmptyState />
                )}

              </section>

              {/* REGIÃO PILOTO */}
              <section className="glass rounded-2xl p-6 xl:col-span-2">

                <h2 className="heading text-xl font-bold text-white mb-3">
                  Região piloto
                </h2>

                <div className="rounded-2xl h-44 dot-grid bg-[#102c3a] border border-[#234c5b] flex flex-col items-center justify-center gap-3">
                  <MapPin
                    size={34}
                    className="text-teal-300"
                  />

                  <span className="text-sm text-slate-200 font-semibold">
                    FIAP Paulista · São Paulo
                  </span>

                  <span className="text-xs text-slate-400 text-center px-4">
                    Área de estudo do UrbanSense
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-4">
                  Os endereços cadastrados são fornecidos
                  pelos usuários. As condições relatadas
                  ainda não possuem verificação independente.
                </p>

                {/* PROTÓTIPO IOT */}
                <div className="mt-5 pt-4 border-t border-slate-700/60">

                  <div className="flex items-center gap-2 text-teal-300 mb-2">
                    <RadioTower size={18} />

                    <span className="text-sm font-semibold">
                      Protótipo IoT
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simulação independente com ESP32,
                    sensor LDR, LCD e alertas.
                    A integração automática com o
                    Supabase ainda não foi implementada.
                  </p>

                  <a
                    className="text-teal-300 text-sm flex gap-2 mt-4 items-center"
                    target="_blank"
                    rel="noreferrer"
                    href="https://wokwi.com/projects/480078211156907009"
                  >
                    Abrir protótipo no Wokwi
                    <ExternalLink size={15} />
                  </a>

                </div>
              </section>

            </div>
          </>
        )}

        {/* GESTÃO DE OCORRÊNCIAS */}
        {page === "ocorrencias" && (
          <>
            <div className="flex flex-wrap justify-between gap-3 items-center mb-5">

              <div>
                <h2 className="heading text-xl font-bold text-white">
                  Registros de acessibilidade
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Dados persistidos no Supabase ·
                  CRUD com autenticação
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  className="ghost flex gap-2 items-center"
                  onClick={api.carregar}
                  disabled={api.loading}
                >
                  <RefreshCw
                    size={16}
                    className={api.loading ? "animate-spin" : ""}
                  />
                  Atualizar
                </button>

                <button
                  type="button"
                  className="action flex gap-2 items-center"
                  onClick={abrirNovo}
                >
                  <Plus size={17} />
                  Nova ocorrência
                </button>

              </div>
            </div>

            {/* AVISO SOBRE OS REGISTROS */}
            <div className="mb-5 rounded-xl border border-sky-400/20 bg-sky-400/5 px-4 py-3">
              <p className="text-xs text-slate-300">
                Os registros são armazenados no Supabase,
                mas as condições urbanas relatadas não
                são verificadas automaticamente.
                Esta plataforma é um protótipo acadêmico.
              </p>
            </div>

            {/* FILTROS */}
            <Filters f={filtros} />

            {/* LISTAGEM DE OCORRÊNCIAS */}
            {api.loading ? (
              <p className="text-slate-400">
                Carregando ocorrências do Supabase...
              </p>
            ) : api.error ? (
              <p className="text-red-300 text-sm">
                Não foi possível consultar as ocorrências.
              </p>
            ) : filtros.filtrados.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

                {filtros.filtrados.map((item) => (
                  <OcorrenceCard
                    key={item.id}
                    item={item}
                    usuarioId={user?.id}
                    onEdit={editar}
                    onDelete={excluir}
                  />
                ))}

              </div>
            ) : (
              <EmptyState
                text="Nenhuma ocorrência corresponde aos filtros."
              />
            )}
          </>
        )}

        {/* SOBRE O URBANSENSE */}
        {page === "sobre" && (
          <div className="glass rounded-3xl p-7 md:p-10 max-w-4xl">

            <div className="text-teal-300 text-sm uppercase tracking-widest font-bold mb-3">
              Sobre a solução
            </div>

            <h2 className="heading text-3xl md:text-4xl font-bold text-white mb-5">
              Tecnologia cidadã para observar barreiras urbanas.
            </h2>

            <p className="text-slate-300 leading-8 mb-5">
              O UrbanSense é um projeto acadêmico
              individual desenvolvido para a
              Global Solution 2026.2 da FIAP.
              A plataforma permite registrar,
              consultar e gerenciar ocorrências
              relacionadas à acessibilidade urbana.
            </p>

            <p className="text-slate-300 leading-8 mb-5">
              A aplicação utiliza React e Supabase
              para autenticação de usuários e
              persistência dos registros em um
              banco de dados PostgreSQL.
            </p>

            <p className="text-slate-300 leading-8 mb-5">
              Os usuários autenticados podem
              cadastrar ocorrências e gerenciar
              os registros de sua autoria.
            </p>

            <p className="text-slate-300 leading-8 mb-5">
              O protótipo de Edge Computing
              utiliza ESP32, sensor LDR, LCD,
              LEDs e buzzer para demonstrar
              o monitoramento local de luminosidade.
              A aplicação web ainda não recebe
              dados automaticamente do dispositivo.
            </p>

            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200 text-sm">
              O UrbanSense é um protótipo acadêmico.
              A existência de registros no banco
              não significa que os problemas relatados
              tenham sido verificados presencialmente.
              A plataforma não certifica a segurança
              ou acessibilidade dos trajetos.
            </div>

            <div className="flex gap-2 items-center mt-6 text-sm text-slate-400">
              <Activity size={17} />
              Desenvolvido por João Vitor Batista
              De Mattos · RM 571389
            </div>

          </div>
        )}

        {/* RODAPÉ */}
        <Footer />

        {/* FORMULÁRIO DE CADASTRO E EDIÇÃO */}
        {modal && (
          <OcorrenceForm
            item={editing}
            onSave={salvar}
            onClose={() => {
              setModal(false);
              setEditing(null);
            }}
          />
        )}

      </main>
    </div>
  );
}
