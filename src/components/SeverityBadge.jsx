
const gravidades = {
  Baixa: {
    texto: "Baixa",
    cores:
      "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
  },

  Media: {
    texto: "Média",
    cores:
      "bg-amber-500/15 text-amber-300 border-amber-500/30"
  },

  Alta: {
    texto: "Alta",
    cores:
      "bg-orange-500/15 text-orange-300 border-orange-500/30"
  }
};

export default function SeverityBadge({ value }) {
  const gravidade = gravidades[value];

  return (
    <span
      className={`
        inline-block rounded-full border
        px-2.5 py-1 text-xs font-semibold
        whitespace-nowrap
        ${
          gravidade?.cores ||
          "bg-slate-500/10 text-slate-300 border-slate-500/30"
        }
      `}
    >
      {gravidade?.texto || value || "Não informada"}
    </span>
  );
}
