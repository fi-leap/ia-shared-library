# ia-shared-library

Biblioteca central de **skills**, **agents** e **tools** para projetos Claude Code.

Crie uma vez, use em qualquer repositório — via plugin Claude Code ou servidor MCP.

---

## O que está incluído

| Tipo | Nome | Descrição |
|------|------|-----------|
| Skill | `math-operations` | Cálculos, equações e estatística (auto-invocada) |
| Agent | `math-agent` | Raciocínio matemático multi-etapas |
| Command | `/math` | Invocação explícita de operações matemáticas |
| MCP Tool | `calculate` | Avalia expressões matemáticas com precisão |
| MCP Tool | `statistics` | Estatística descritiva sobre datasets |
| MCP Tool | `solve_equation` | Resolve equações lineares e quadráticas |

---

## Instalação

### Pré-requisitos
- Node.js >= 18
- Claude Code CLI

### 1. Build do MCP server

```bash
cd /path/to/ia
npm run build
```

### 2a. Instalação Global (skills disponíveis em todos os projetos)

```bash
./install.sh
```

Instala o plugin em `~/.claude/plugins/ia-shared-library/`.

### 2b. Instalação em Projeto Específico

```bash
./install.sh --project /caminho/para/seu-projeto
```

Isso cria em `seu-projeto/`:
- `.claude/commands/math.md` — slash command `/math`
- `.mcp.json` — configuração do servidor MCP
- `.claude/ia-skills-context.md` — contexto para a IA do projeto

### 3. Remoção

```bash
./uninstall.sh                          # Remove instalação global
./uninstall.sh --project /path/to/repo  # Remove de projeto específico
```

---

## Como Usar

### Em linguagem natural (skill auto-invocada)
A IA detecta automaticamente quando usar a skill de matemática:
```
"calcule 15% de 200"
"resolva x^2 - 4 = 0"
"média e desvio padrão de [10, 20, 30, 40]"
```

### Via slash command
```
/math 2^10
/math juros compostos 1000 a 5% por 12 meses
```

### Via MCP Tools (execução precisa)
Com o servidor MCP configurado, a IA pode chamar diretamente:
```
calculate("sqrt(2) * pi")           → 4.4428829381583655
statistics([1,2,3,4,5], ["mean"])   → {"mean": 3}
solve_equation("x^2 - 9 = 0", "x") → "x = 3\nx = -3"
```

---

## Para Outros Repositórios via npm (publicação futura)

Após publicar `mcp-server/` no npm como `@filipe/ia-tools`:

```json
// .mcp.json do projeto terceiro
{
  "mcpServers": {
    "ia-tools": {
      "command": "npx",
      "args": ["@filipe/ia-tools"]
    }
  }
}
```

---

## Adicionando Novos Recursos

Veja `CLAUDE.md` para guia completo de como adicionar:
- Novas skills
- Novos agents
- Novos MCP tools

Veja `CATALOG.md` para o catálogo completo de todos os recursos disponíveis.

---

## Estrutura do Repositório

```
ia/
├── .claude-plugin/
│   └── plugin.json          # Metadados do plugin (marketplace-compatible)
├── .mcp.json                # MCP config para uso local
├── registry.json            # Registro machine-readable de todos os recursos
├── CATALOG.md               # Documentação detalhada para humanos e IAs
├── CLAUDE.md                # Guia para IAs trabalhando neste repo
├── skills/
│   └── math-operations/
│       ├── SKILL.md         # Definição da skill
│       └── scripts/
│           └── calculate.js # Helper de cálculo
├── agents/
│   └── math-agent.md        # Agente especializado
├── commands/
│   └── math.md              # Slash command /math
├── mcp-server/              # Servidor MCP (TypeScript, publicável no npm)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       └── tools/
│           ├── index.ts
│           └── math.ts
├── install.sh               # Script de instalação
└── uninstall.sh             # Script de remoção
```
