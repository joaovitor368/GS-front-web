
import { useState } from 'react';

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
} from 'lucide-react';

import Sidebar from './components/SideBar';
import Header from './components/Header';
import Hero from './components/Hero';
import StatCard from './components/StatCard';
import OcorrenceCard from './components/OcorrenceCard';
import OcorrenceForm from './components/OcorrenceForm';
import Filters from './components/Filters';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';

import { useOcorrencias } from './hooks/useOcorrencias';
import { useFiltros } from './hooks/useFiltros';

export default function App() {
  const [page, setPage] = useState('painel');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const api = useOcorrencias();
  const filtros = useFiltros(api.items);

  const abrirNovo = () => {
    setEditing(null);
    setModal(true);
  };

  const editar = (item) => {
    setEditing(item);
    setModal(true);
  };

  const salvar = async (data) => {
    const ok = editing
      ? await api.atualizar(editing.id, data)
      : await api.criar(data);

    if (ok) {
      setNotice(
        editing
          ? 'Ocorrência atualizada.'
          : 'Ocorrência cadastrada.'
      );
    }

    return ok;
  };

  const excluir = async (item) => {
    if (window.confirm(`Excluir a ocorrência "${item.titulo}"?`)) {
      if (await api.excluir(item.id)) {
        setNotice('Ocorrência excluída.');
      }
    }
  };

  const total = api.items.length;

  const criticas = api.items.filter((x) =>
    ['Alta', 'Crítica'].includes(x.gravidade)
  ).length;

  const resolvidas = api.items.filter(
    (x) => x.status === 'Resolvido'
  ).length;

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar page={page} setPage={setPage} />

      <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
        <Header page={page} />

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl bg-teal-400/10 border border-teal-400/30 px-4 py-3 text-teal-200 text-sm flex justify-between"
          >
            {notice}

            <button onClick={() => setNotice('')}>
              Fechar
            </button>
          </div>
        )}

        {api.error && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-red-500/10 border border-red-500/40 p-4 text-red-200 text-sm"
          >
            {api.error}

            <button
              onClick={api.carregar}
              className="underline ml-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* PAINEL PRINCIPAL */}

        {page === 'painel' && (
          <>
            <Hero onOpen={() => setPage('ocorrencias')} />

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Ocorrências"
                value={total}
                sub="Registros de demonstração"
                Icon={ClipboardList}
              />

              <StatCard
                label="Alta ou crítica"
                value={criticas}
                sub="Prioridade ilustrativa"
                Icon={AlertTriangle}
                accent="text-orange-300"
              />

              <StatCard
                label="Resolvidas"
                value={resolvidas}
                sub="Status simulado"
                Icon={CheckCircle2}
              />

              <StatCard
                label="Monitor IoT"
                value="ESP32"
                sub="Simulação disponível no Wokwi"
                Icon={RadioTower}
                accent="text-sky-300"
              />
            </div>

            <div className="grid xl:grid-cols-5 gap-5">
              <section className="glass rounded-2xl p-6 xl:col-span-3">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="heading text-xl font-bold text-white">
                    Ocorrências recentes
                  </h2>

                  <button
                    onClick={() => setPage('ocorrencias')}
                    className="text-sm text-teal-300"
                  >
                    Ver todas →
                  </button>
                </div>

                {api.loading ? (
                  <p className="text-slate-400">
                    Carregando API...
                  </p>
                ) : api.items.length ? (
                  <div className="space-y-3">
                    {api.items.slice(0, 4).map((x) => (
                      <div
                        key={x.id}
                        className="border-b border-slate-700/60 pb-3 flex justify-between gap-4"
                      >
                        <div>
                          <div className="text-sm text-white font-semibold">
                            {x.titulo}
                          </div>

                          <div className="text-xs text-slate-400 mt-1">
                            {x.local}
                          </div>
                        </div>

                        <span className="text-xs text-teal-300 shrink-0">
                          {x.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </section>

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

                  <span className="text-xs text-slate-400">
                    Área de estudo, sem pontos georreferenciados
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-4">
                  O mapa de ocorrências reais será integrado
                  somente após coleta e validação de coordenadas.
                </p>

                <a
                  className="text-teal-300 text-sm flex gap-2 mt-4 items-center"
                  target="_blank"
                  rel="noreferrer"
                  href="https://wokwi.com/projects/480078211156907009"
                >
                  Abrir protótipo IoT
                  <ExternalLink size={15} />
                </a>
              </section>
            </div>
          </>
        )}

        {/* PÁGINA DE OCORRÊNCIAS */}

        {page === 'ocorrencias' && (
          <>
            <div className="flex flex-wrap justify-between gap-3 items-center mb-5">
              <div>
                <h2 className="heading text-xl font-bold text-white">
                  Registros de acessibilidade
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  CRUD real via API REST local · dados de demonstração
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="ghost flex gap-2 items-center"
                  onClick={api.carregar}
                >
                  <RefreshCw size={16} />
                  Atualizar
                </button>

                <button
                  className="action flex gap-2 items-center"
                  onClick={abrirNovo}
                >
                  <Plus size={17} />
                  Nova ocorrência
                </button>
              </div>
            </div>

            <Filters f={filtros} />

            {api.loading ? (
              <p className="text-slate-400">
                Carregando ocorrências...
              </p>
            ) : filtros.filtrados.length ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtros.filtrados.map((x) => (
                  <OcorrenceCard
                    key={x.id}
                    item={x}
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

        {/* SOBRE O PROJETO */}

        {page === 'sobre' && (
          <div className="glass rounded-3xl p-7 md:p-10 max-w-4xl">
            <div className="text-teal-300 text-sm uppercase tracking-widest font-bold mb-3">
              Sobre a solução
            </div>

            <h2 className="heading text-3xl md:text-4xl font-bold text-white mb-5">
              Tecnologia cidadã para observar barreiras urbanas.
            </h2>

            <p className="text-slate-300 leading-8 mb-5">
              O UrbanSense é um projeto acadêmico individual da
              Global Solution 2026.2 da FIAP. A plataforma permite
              registrar e gerenciar ocorrências ilustrativas
              relacionadas a obstáculos e condições urbanas que
              podem afetar a mobilidade.
            </p>

            <p className="text-slate-300 leading-8 mb-5">
              O protótipo de Edge Computing utiliza ESP32,
              sensor LDR, LCD, LEDs e buzzer para demonstrar
              monitoramento local de iluminação. A aplicação
              web não recebe telemetria automática do ESP32
              nesta versão.
            </p>

            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200 text-sm">
              Todos os registros iniciais são fictícios.
              A plataforma não certifica acessibilidade,
              segurança ou condições reais de qualquer trajeto.
            </div>

            <div className="flex gap-2 items-center mt-6 text-sm text-slate-400">
              <Activity size={17} />
              Desenvolvido por João Vitor Batista De Mattos · RM 571389
            </div>
          </div>
        )}

        <Footer />

        {/* FORMULÁRIO DE CADASTRO E EDIÇÃO */}

        {modal && (
          <OcorrenceForm
            item={editing}
            onSave={salvar}
            onClose={() => setModal(false)}
          />
        )}
      </main>
    </div>
  );
}
