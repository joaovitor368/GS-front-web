# AI.md — Registro de Utilização de Inteligência Artificial

## Projeto UrbanSense
**Instituição:** FIAP  
**Curso:** Engenharia de Software  
**Disciplina/Projeto:** Global Solution 2026.2 — CitizenTech  
**Aluno:** João Vitor Batista de Mattos  
**RM:** 571389

## 1. Objetivo

Este documento apresenta a utilização de ferramentas de Inteligência Artificial, a ferramenta utilizada foi o ChatGPT, da OpenAI, como recurso de apoio técnico para esclarecimento de dúvidas, geração e revisão de trechos de código, identificação de erros e sugestões de melhorias.

## 2. Aplicações da Inteligência Artificial

A IA foi utilizada durante diferentes etapas do desenvolvimento, principalmente nas seguintes atividades:

- **Depuração:** identificação de inconsistências entre o código React e a estrutura do banco de dados Supabase.
- **Integração:** auxílio na implementação e revisão das operações CRUD.
- **Componentização:** apoio na organização e atualização de componentes reutilizáveis.
- **Interface:** sugestões de melhorias na apresentação das informações e mensagens do sistema.


## 3. Exemplos de solicitações realizadas

Os exemplos abaixo representam solicitações feitas durante o desenvolvimento, com redação resumida para fins de documentação.

**Exemplo 1 — Integração com banco de dados**

> Como corrigir os erros de cadastro de ocorrências no Supabase, considerando que os campos do formulário React precisam corresponder às colunas da tabela?

**Resultado:** revisão dos campos utilizados no formulário e correção de incompatibilidades com o banco de dados.

**Exemplo 2 — Filtros de ocorrências**

> Analise meu hook useFiltros.js e verifique se ele funciona com os valores de gravidade e status armazenados no Supabase.

**Resultado:** atualização da lógica de filtragem e tratamento de diferenças entre textos exibidos na interface e valores armazenados.

**Exemplo 3 — Exibição dos registros**

> Corrija o componente OcorrenceCard.jsx para exibir corretamente o endereço, a gravidade e o status das ocorrências.

**Resultado:** substituição de referências a campos antigos e melhoria da apresentação dos registros.

**Exemplo 4 — Controle de acesso**

> Como fazer com que os botões de edição e exclusão apareçam somente nas ocorrências cadastradas pelo usuário autenticado?

**Resultado:** inclusão de uma verificação de autoria na interface, mantendo a necessidade de políticas de segurança no Supabase.

## 4. Validação das sugestões

As soluções sugeridas pela IA foram utilizadas como apoio à implementação e passaram por testes manuais durante o desenvolvimento.

Entre as verificações realizadas estiveram o cadastro, a consulta, a edição e a exclusão de ocorrências no Supabase.

O funcionamento de recursos ainda não validados, como a atualização automática em tempo real, não é considerado comprovado neste documento.


## 5. Considerações finais

A utilização do ChatGPT contribuiu para o desenvolvimento do UrbanSense ao oferecer suporte na resolução de problemas técnicos, na revisão de componentes React e na integração com o Supabase.

A ferramenta também auxiliou na compreensão de erros encontrados durante a implementação e na organização de soluções para melhorar a aplicação.

O projeto demonstra a aplicação prática de conceitos de desenvolvimento web, componentização, autenticação e persistência de dados.