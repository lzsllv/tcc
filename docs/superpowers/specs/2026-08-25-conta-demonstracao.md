# Conta de demonstração — Especificação

## Objetivo
Preencher, com um clique no Dashboard, uma conta totalmente vazia com dados coerentes para utilizar todas as áreas do site.

## Comportamento aprovado
- Exibir **Preencher conta de demonstração** somente com workspace pronto e conta inteira vazia.
- Considerar workspace v2 e os dados legados ainda usados por Dashboard, Simulação, Relatório e Configurações.
- Preencher identidade, logo demonstrativa, margem, custo/hora, região, custos fixos, insumos, fichas de produtos e serviço, planejamento mensal e canais.
- Não executar nem preencher automaticamente a simulação.
- Ocultar o botão após sucesso e mostrar feedback acessível.
- Recusar sem alterações se qualquer área já tiver dados do usuário.

## Critérios de aceite
1. A conta nova carrega a demonstração uma única vez.
2. Todas as áreas recebem dados utilizáveis.
3. Dados modernos ou legados existentes bloqueiam a ação.
4. O gerador é imutável.
5. Testes, lint, build e validação visual passam.
