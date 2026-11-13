
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  Info,
  ExternalLink,
  Database,
  ShieldAlert,
  Cpu
} from "lucide-react";

// LINKS DE NAVEGAÇÃO
const links = [
  ["painel", "Visão geral", LayoutDashboard],
  ["ocorrencias", "Ocorrências", ClipboardList],
  ["sobre", "Sobre o projeto", Info]
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="lg:w-64 shrink-0 lg:min-h-screen bg-[#0b1728] border-b lg:border-b-0 lg:border-r border-[#263b54] p-5 lg:p-7">

      {/* LOGOTIPO */}
      <div className="flex items-center gap-3 mb-7 lg:mb-12">
        <div className="w-11 h-11 rounded-2xl bg-teal-400 text-slate-950 grid place-items-center">
          <Activity size={25} />
        </div>

        <div>
          <div className="heading font-bold text-xl tracking-tight text-white">
            Urban
            <span className="text-teal-400">
              Sense
            </span>
          </div>

          <div className="text-[10px] tracking-[.22em] text-slate-400 uppercase">
            CitizenTech · FIAP
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO */}
      <nav
        aria-label="Navegação principal"
        className="flex lg:flex-col gap-2 overflow-x-auto"
      >
        {links.map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPage(key)}
            aria-current={page === key ? "page" : undefined}
            className={`
              flex items-center gap-3 px-4 py-3
              rounded-xl text-left whitespace-nowrap
              transition border
              ${
                page === key
                  ? "bg-teal-400/15 text-teal-300 border-teal-400/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
              }
            `}
          >
            <Icon size={18} />

            <span className="text-sm font-semibold">
              {label}
            </span>
          </button>
        ))}
      </nav>

      {/* INFORMAÇÕES DO PROJETO */}
      <div className="hidden lg:block mt-16 space-y-4">

        {/* SUPABASE */}
        <div className="p-4 rounded-2xl bg-[#10253a] border border-[#24425b]">
          <div className="flex items-center gap-2 text-xs text-teal-300 font-bold uppercase tracking-wider">
            <Database size={15} />
            Dados persistidos
          </div>

          <p className="text-xs leading-relaxed text-slate-400 mt-2">
            As ocorrências cadastradas são armazenadas
            no Supabase e podem ser consultadas e
            gerenciadas por usuários autorizados.
          </p>
        </div>

        {/* AVISO DE SEGURANÇA */}
        <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <ShieldAlert size={15} />
            Protótipo acadêmico
          </div>

          <p className="text-xs leading-relaxed text-slate-400 mt-2">
            Os relatos urbanos são enviados por
            usuários e não possuem verificação
            independente. Não utilize a plataforma
            para determinar se um trajeto é seguro.
          </p>
        </div>

        {/* ESP32 */}
        <div className="p-4 rounded-2xl bg-[#10253a] border border-[#24425b]">
          <div className="flex items-center gap-2 text-xs text-teal-300 font-bold uppercase tracking-wider">
            <Cpu size={15} />
            Protótipo IoT
          </div>

          <p className="text-xs leading-relaxed text-slate-400 mt-2">
            Simulação de monitoramento com ESP32,
            sensor LDR, display LCD e alertas.
            Ainda sem integração automática
            com a plataforma web.
          </p>

          <a
            href="https://wokwi.com/projects/480078211156907009"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-teal-300 mt-4 flex gap-2 items-center hover:text-teal-200 transition"
          >
            Ver ESP32 no Wokwi
            <ExternalLink size={13} />
          </a>
        </div>

      </div>
    </aside>
  );
}
