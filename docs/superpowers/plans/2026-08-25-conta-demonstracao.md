# Conta de demonstração Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar uma conta vazia pronta para demonstração em todas as áreas do site.

**Architecture:** `src/application/demoAccount.js` concentra dados e elegibilidade. `AppContext` persiste primeiro o workspace v2 e depois sincroniza os estados legados. O Dashboard apenas apresenta e aciona a operação.

**Tech Stack:** React 19, JavaScript ES Modules, Node Test Runner, Vite e CSS.

**Spec:** `docs/superpowers/specs/2026-08-25-conta-demonstracao.md`

## Global Constraints
- Nunca substituir dados existentes.
- Não executar a simulação.
- Manter compatibilidade v2 e legada.
- Não adicionar dependências.

---

### Task 1: Caso de uso demonstrativo
**Files:** Create `src/application/demoAccount.js`; Test `src/application/demoAccount.test.js`.
**Interfaces:** `isDemoAccountEmpty(account): boolean`; `createDemoAccount(account, now): DemoAccount`.
- [ ] Escrever testes de conta vazia e recusas por produto, configuração, custo, insumo, oferta ou canal.
- [ ] Executar o teste e confirmar RED por módulo ausente.
- [ ] Implementar a regra mínima de elegibilidade.
- [ ] Confirmar GREEN.
- [ ] Escrever testes do conjunto completo, referências, proprietário, proteção e imutabilidade.
- [ ] Confirmar RED pela ausência do gerador.
- [ ] Implementar dados determinísticos: logo SVG, insumos, duas fichas de produto, uma de serviço, custos e três canais.
- [ ] Confirmar GREEN e commit `feat: add protected demo account data`.

### Task 2: Persistência coordenada
**Files:** Modify `src/context/AppContext.jsx`; Test `src/application/demoAccount.test.js`.
**Interfaces:** `carregarDemo(): Promise<void>`; `podeCarregarDemo: boolean`.
- [ ] Testar a representação legada coerente e confirmar RED.
- [ ] Remover dados duplicados do contexto, calcular elegibilidade, persistir workspace primeiro e sincronizar legado após sucesso.
- [ ] Executar `node --test` e confirmar GREEN.
- [ ] Commit `feat: persist full demo account safely`.

### Task 3: Dashboard
**Files:** Modify `src/pages/Dashboard.jsx` e `src/styles/Dashboard.css`.
**Interfaces:** Consome `podeCarregarDemo` e `carregarDemo`; produz ação condicional, carregamento e feedback acessível.
- [ ] Adicionar ação assíncrona sem navegação ou execução de simulação.
- [ ] Estilizar grupo responsivo, botão secundário e feedback.
- [ ] Executar lint e build.
- [ ] Commit `feat: add demo account action to dashboard`.

### Task 4: Verificação final
**Files:** Review todos os arquivos alterados.
- [ ] Executar testes, lint e build em cópia local limpa.
- [ ] Validar visualmente botão, carregamento, desaparecimento, KPIs e responsividade.
- [ ] Revisar diff e estado limpo da branch.
