---
name: math-operations
description: >
  Use this skill when the user asks to perform mathematical calculations,
  solve equations, compute statistics, or needs any numerical analysis.
  Trigger examples: "calcule", "quanto é", "resolva a equação", "média de",
  "desvio padrão", "percentual", "fatorial", "raiz quadrada", "integral",
  "derivada", "calcular juros", "porcentagem".
version: 1.0.0
argument-hint: <expressão matemática>
allowed-tools: [Bash]
---

# Math Operations Skill

Você é especialista em operações matemáticas. Use esta skill para responder com precisão a qualquer pedido de cálculo, equação ou análise estatística.

## Capacidades

| Categoria | Operações | Exemplo de entrada | Saída esperada |
|-----------|-----------|-------------------|----------------|
| Aritmética | +, -, *, /, ^, % | "quanto é 15% de 200?" | 30 |
| Álgebra | equações lineares/quadráticas | "resolva x^2 - 4 = 0" | x = ±2 |
| Estatística | média, mediana, desvio padrão | "média de [10, 20, 30, 40]" | 25 |
| Funções | sqrt, log, sin, cos, tan, exp | "raiz quadrada de 144" | 12 |
| Financeiro | juros simples/compostos, percentuais | "juros de 5% ao mês por 12 meses sobre 1000" | R$ 1795,86 |
| Combinatória | fatorial, combinações, permutações | "C(10,3)" | 120 |

## Como Resolver

### Cálculos diretos
Para expressões simples, execute via `scripts/calculate.js` para garantir precisão numérica:

```bash
node /path/to/ia/skills/math-operations/scripts/calculate.js "<expressão>"
```

### Equações
1. Identifique a variável a isolar
2. Aplique as transformações algébricas
3. Apresente TODAS as soluções (incluindo complexas quando relevante)
4. Verifique substituindo de volta na equação original

### Estatística
Para conjuntos de dados, calcule e apresente:
- Medidas de tendência central (média, mediana, moda)
- Medidas de dispersão (desvio padrão, variância, amplitude)
- Apresente os cálculos intermediários

## Formato de Resposta

Sempre apresente:
1. **Resultado principal** em destaque
2. **Passos intermediários** quando relevante para compreensão
3. **Unidades** quando aplicável
4. **Verificação** para equações

Exemplo de resposta para "calcule 15% de 200":
```
**Resultado: 30**

Cálculo: 200 × 0,15 = 30
```

## Quando usar o MCP Tool `calculate`
Se o repositório atual tiver o MCP server `ia-tools` configurado (verificável em `.mcp.json`), prefira usar a tool `calculate` para expressões complexas — ela garante precisão numérica via mathjs:

```
calculate("200 * 0.15")         → 30
calculate("sqrt(2) * pi")       → 4.442882938158366
statistics([10,20,30,40], ["mean", "std"])  → {"mean": 25, "std": 12.91}
solve_equation("x^2 - 4 = 0", "x")        → ["x = 2", "x = -2"]
```
