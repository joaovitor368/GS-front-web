import { useMemo, useState } from 'react';
export function useFiltros(items) {
 const [busca,setBusca]=useState(''); const [gravidade,setGravidade]=useState('Todas'); const [status,setStatus]=useState('Todos');
 const filtrados=useMemo(()=>items.filter(x=>[x.titulo,x.local,x.tipo].some(v=>String(v).toLowerCase().includes(busca.toLowerCase())) && (gravidade==='Todas'||x.gravidade===gravidade) && (status==='Todos'||x.status===status)),[items,busca,gravidade,status]);
 return {busca,setBusca,gravidade,setGravidade,status,setStatus,filtrados};
}
