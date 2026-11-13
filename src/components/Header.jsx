
import { Bell, MapPin, Database, Wifi, WifiOff } from "lucide-react";

export default function Header({ page, conectado = false }) {
  const names = {
    painel: "Painel de acessibilidade",
    ocorrencias: "Gestão de ocorrências",
    sobre: "Sobre o UrbanSense"
  };

  return (
    <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
      <div>
        <div className="text-xs text-slate-400 mb-2 flex gap-1 items-center">
          <MapPin size={13} />
          São Paulo · Região FIAP Paulista
        </div>

        <h1 className="heading text-2xl md:text-3xl font-bold text-white">
          {names[page] || "UrbanSense"}
        </h1>
      </div>

      <div className="flex gap-3 items-center">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 border text-xs font-semibold ${
            conectado
              ? "text-teal-300 border-teal-400/30 bg-teal-400/10"
              : "text-amber-300 border-amber-400/30 bg-amber-400/10"
          }`}
        >
          <Database size={14} />

          {conectado ? (
            <>
              <Wifi size={14} />
              SUPABASE CONECTADO
            </>
          ) : (
            <>
              <WifiOff size={14} />
              CONEXÃO NÃO VERIFICADA
            </>
          )}
        </div>

        <div
          className="rounded-full w-10 h-10 border border-slate-600 grid place-items-center text-slate-300"
          title="Notificações"
        >
          <Bell size={17} />
        </div>
      </div>
    </header>
  );
}
