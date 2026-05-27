---
name: math
description: Perform mathematical calculations, solve equations, or compute statistics
argument-hint: <expression or problem>
allowed-tools: [Bash]
---

Resolva o seguinte problema matemático com precisão e mostre os passos:

**Entrada**: $ARGUMENTS

## Instruções

1. Interprete a expressão ou problema fornecido
2. Se for uma expressão numérica, calcule usando o script helper:
   ```bash
   node skills/math-operations/scripts/calculate.js "<expressão>"
   ```
3. Se for uma equação, resolva algebricamente mostrando cada passo
4. Se for um problema estatístico, calcule as métricas relevantes
5. Apresente o resultado final em destaque

## Formato de Saída

```
**Resultado: <valor>**

**Passos:**
1. ...
2. ...

**Verificação:** <substitua o resultado na expressão original>
```

Se nenhum argumento foi fornecido, explique as capacidades disponíveis:
- Cálculos: `/math 15% de 200`
- Equações: `/math resolva x^2 - 4 = 0`
- Estatística: `/math média de [10, 20, 30, 40]`
- Financeiro: `/math juros compostos: 1000 a 5% por 12 meses`
