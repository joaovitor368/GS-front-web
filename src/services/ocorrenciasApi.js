const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options }); }
  catch { throw new Error('API indisponível. Execute npm run dev:all para iniciar a API e o site.'); }
  if (!response.ok) throw new Error(`Falha na API (${response.status}).`);
  return response.status === 204 ? null : response.json();
}
export const ocorrenciasApi = {
  listar: () => request('/ocorrencias'),
  criar: (dados) => request('/ocorrencias', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => request(`/ocorrencias/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => request(`/ocorrencias/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
