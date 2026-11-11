import { useCallback, useEffect, useState } from 'react';
import { ocorrenciasApi } from '../services/ocorrenciasApi';
export function useOcorrencias() {
  const [items,setItems] = useState([]); const [loading,setLoading] = useState(true); const [error,setError] = useState('');
  const carregar = useCallback(async () => { setLoading(true); setError(''); try { setItems(await ocorrenciasApi.listar()); } catch(e) { setError(e.message); } finally { setLoading(false); } },[]);
  useEffect(()=>{ carregar(); },[carregar]);
  const executar = async (acao) => { setError(''); try { await acao(); await carregar(); return true; } catch(e) { setError(e.message); return false; } };
  return { items,loading,error,carregar,criar:(d)=>executar(()=>ocorrenciasApi.criar(d)),atualizar:(id,d)=>executar(()=>ocorrenciasApi.atualizar(id,d)),excluir:(id)=>executar(()=>ocorrenciasApi.excluir(id)) };
}
