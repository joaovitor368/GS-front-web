# UrbanSense — Front-end Design & Web Development

**Aluno:** João Vitor Batista De Mattos — **RM:** 571389  
**FIAP | Global Solution 2026.2 — CitizenTech**

## Visão geral
Aplicação web para cadastro, consulta, edição e exclusão de ocorrências **simuladas** sobre barreiras urbanas. Não há dados de campo verificados nem cálculo de segurança de rotas. A mesma base atende às disciplinas Front-end Design e Web Development.

## Tecnologias
React 18, Vite 6, Tailwind CSS 3, Lucide React e JSON Server (API REST independente do frontend). Hooks `useState`, `useEffect`, `useOcorrencias` e `useFiltros`. Mais de 8 componentes reutilizáveis.

## Executar no VS Code
1. Instale Node.js (preferencialmente LTS, versão 20 ou superior) e abra esta pasta no VS Code.
2. Abra o terminal e execute `npm install`.
3. Execute `npm run dev:all` para iniciar **API na porta 3001** e **site na porta 5173**.
4. Abra `http://localhost:5173` no navegador.
5. Em **Ocorrências**, teste criar, listar, editar e excluir; os dados persistem no arquivo `db.json` enquanto o JSON Server está rodando.

### Comandos separados
- `npm run api`: somente API REST em `http://localhost:3001/ocorrencias`.
- `npm run dev`: somente React em `http://localhost:5173`.
- `npm run build`: compila o frontend para produção.
- `npm run preview`: pré-visualiza a build.

## Estrutura
- `src/components/`: Sidebar, Header, Hero, StatCard, SeverityBadge, OccurrenceCard, OccurrenceForm, Filters, EmptyState e Footer.
- `src/hooks/`: `useOcorrencias` (API/estado) e `useFiltros` (busca e filtros).
- `src/services/ocorrenciasApi.js`: funções REST GET/POST/PUT/DELETE.
- `db.json`: base **simulada** da API JSON Server.
- `AI.md`: registro de apoio por IA.

## API / integração
O frontend consome uma API HTTP REST em **outro processo e porta**, via `fetch`. O JSON Server fornece operações CRUD reais em ambiente local, com persistência em arquivo. **Não é uma API hospedada externamente na internet**; para o deploy final será necessário hospedar um backend ou contratar serviço de API com persistência. Configuração opcional: copie `.env.example` para `.env` e altere `VITE_API_URL`.

## Integração Edge
Protótipo ESP32: https://wokwi.com/projects/480078211156907009. Nesta versão, o frontend apenas abre o link; não recebe dados do ESP32 automaticamente.

## Publicação e entrega
Crie repositório **privado** e faça **15 commits reais e significativos** durante a evolução; não invente histórico. Conceda acesso de escrita aos professores conforme orientação do Teams. Publique o frontend e hospede uma API persistente, configure `VITE_API_URL`, teste o CRUD online e entregue os links, ZIP e documentação separadamente nas duas disciplinas.

## Limitações e ética
Dados e trechos são simulados; não representam obstáculos observados nem rotas seguras. O projeto não substitui vistoria, validação comunitária ou normas de acessibilidade.
