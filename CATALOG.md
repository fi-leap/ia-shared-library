# ia-shared-library — Catálogo de Recursos

> Este catálogo é destinado tanto a humanos quanto a IAs. Ao trabalhar em um projeto que instalou esta biblioteca, leia este arquivo para descobrir tudo que está disponível.

---

## Como Usar Este Catálogo

1. **IA em outro repositório**: Se este projeto foi instalado no seu repositório (via `install.sh`), verifique `.claude/ia-skills-context.md` para instruções específicas do projeto. Para o catálogo completo, leia este arquivo.
2. **Desenvolvedor**: Veja o `README.md` para instruções de instalação.
3. **Referência rápida machine-readable**: veja `registry.json`.

---

## Skills (Invocação Automática)

Skills são instruções que a IA usa automaticamente quando detecta o contexto adequado. Não é necessário invocar explicitamente — a IA reconhece os gatilhos.

### math-operations

| Campo | Valor |
|-------|-------|
| **ID** | `math-operations` |
| **Arquivo** | `skills/math-operations/SKILL.md` |
| **Comando explícito** | `/math <expressão>` |
| **Modelo** | padrão (herda do contexto) |
| **Tools permitidas** | `Bash` |

**Gatilhos automáticos** — A IA invoca esta skill quando o usuário pede:
- Cálculos aritméticos ("quanto é", "calcule", "compute")
- Equações ("resolva", "encontre x", "raízes de")
- Estatística ("média", "desvio padrão", "mediana", "variância")
- Percentuais ("15% de", "desconto de", "porcentagem")
- Funções matemáticas ("raiz quadrada", "logaritmo", "fatorial")
- Problemas financeiros ("juros", "rendimento", "amortização")

**Capacidades:**

| Categoria | Exemplos de entrada | Saída |
|-----------|-------------------|-------|
| Aritmética | `"2^10 + sqrt(144)"` | `1036` |
| Percentual | `"15% de 200"` | `30` |
| Equação linear | `"2x + 5 = 13"` | `x = 4` |
| Equação quadrática | `"x^2 - 4 = 0"` | `x = 2, x = -2` |
| Estatística | `"média de [10,20,30,40]"` | `25` |
| Financeiro | `"1000 a 5% ao mês por 12 meses"` | `R$ 1.795,86` |
| Fatorial | `"fatorial de 10"` | `3628800` |
| Trigonometria | `"sen(30°)"` | `0.5` |

**Script helper**: `skills/math-operations/scripts/calculate.js`
```bash
node skills/math-operations/scripts/calculate.js "2^10"
# Output: 1024
```

---

## Agents (Subagentes Especializados)

Agents são invocados quando a tarefa requer raciocínio sustentado e especializado. Use `Agent(subagent_type="math-agent")` no código ou referencie pelo nome.

### math-agent

| Campo | Valor |
|-------|-------|
| **ID** | `math-agent` |
| **Arquivo** | `agents/math-agent.md` |
| **Modelo** | `sonnet` |
| **Especialidade** | Raciocínio matemático complexo e multi-etapas |

**Quando usar**:
- Problemas que exigem múltiplos passos de raciocínio
- Demonstrações e provas matemáticas
- Análise estatística detalhada com interpretação
- Otimização e problemas de cálculo avançado
- Quando o usuário precisa de explicação didática além do resultado

**Capacidades detalhadas**:
- Álgebra e Cálculo: equações diferenciais, integrais, limites, séries
- Probabilidade e Estatística: distribuições, testes de hipótese, regressão
- Teoria dos Números: primos, aritmética modular, combinatória
- Álgebra Linear: matrizes, autovetores, transformações
- Matemática Aplicada: otimização, modelagem financeira

---

## Commands (Slash Commands)

Comandos invocados explicitamente pelo usuário com `/`.

### /math

| Campo | Valor |
|-------|-------|
| **ID** | `math` |
| **Arquivo** | `commands/math.md` |
| **Uso** | `/math <expressão ou problema>` |

**Exemplos de uso**:
```
/math 2^10
/math calcule a média de [10, 20, 30, 40]
/math resolva x^2 - 4 = 0
/math juros compostos: 1000 a 5% ao mês por 12 meses
```

---

## MCP Tools (Execução de Código Real)

Tools expostas via servidor MCP. Disponíveis quando o servidor `ia-tools` está configurado no `.mcp.json` do projeto.

**Verificar disponibilidade**: Cheque se `.mcp.json` contém `"ia-tools"`.

### `calculate`

Avalia qualquer expressão matemática com precisão total via mathjs.

```typescript
calculate(expression: string): string
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `expression` | `string` | Expressão matemática a avaliar |

**Exemplos**:
```
calculate("2^10")           → "1024"
calculate("sqrt(144)")      → "12"
calculate("sin(pi/2)")      → "1"
calculate("15% * 200")      → "30"
calculate("factorial(10)")  → "3628800"
calculate("log(1000, 10)")  → "3"
```

---

### `statistics`

Computa estatísticas descritivas sobre um conjunto de dados.

```typescript
statistics(data: number[], operations: string[]): JSON
```

| Parâmetro | Tipo | Valores aceitos |
|-----------|------|-----------------|
| `data` | `number[]` | Array de números |
| `operations` | `string[]` | `"mean"`, `"median"`, `"mode"`, `"std"`, `"variance"`, `"min"`, `"max"`, `"sum"`, `"count"` |

**Exemplos**:
```
statistics([10, 20, 30, 40], ["mean", "std", "min", "max"])
→ {
    "mean": 25,
    "std": 12.909944487358056,
    "min": 10,
    "max": 40
  }
```

---

### `solve_equation`

Resolve equações lineares e quadráticas para uma variável dada.

```typescript
solve_equation(equation: string, variable?: string): string
```

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `equation` | `string` | — | Equação com `=` separando os lados |
| `variable` | `string` | `"x"` | Variável a isolar |

**Exemplos**:
```
solve_equation("x^2 - 4 = 0", "x")
→ "x = 2
   x = -2"

solve_equation("2*x + 5 = 13", "x")
→ "x = 4"

solve_equation("x^2 + 2*x + 1 = 0", "x")
→ "x = -1 (double root)"

solve_equation("x^2 + 1 = 0", "x")
→ "x = 0 + 1i
   x = 0 - 1i"
```

---

## Adicionando Novos Recursos

### Nova Skill
1. Crie `skills/<nome>/SKILL.md` com frontmatter válido (veja `CLAUDE.md`)
2. Opcionalmente crie `skills/<nome>/scripts/` com helpers
3. Registre em `registry.json`
4. Documente aqui no `CATALOG.md`

### Novo Agent
1. Crie `agents/<nome>.md` com frontmatter `name`, `description`, `model`
2. Registre em `registry.json`

### Novo MCP Tool
1. Implemente em `mcp-server/src/tools/<categoria>.ts`
2. Registre em `mcp-server/src/tools/index.ts`
3. Documente em `CATALOG.md` e `registry.json`
4. Execute `npm run build` no `mcp-server/`
