# ia-shared-library

Biblioteca central de **skills**, **agents** e **tools** para projetos Claude Code.

Crie uma vez, use em qualquer repositório — via plugin Claude Code ou servidor MCP.

---

## O que está incluído

| Tipo | Nome | Descrição |
|------|------|-----------|
| Skill | `git-commit` | Fluxo completo de commit Gitmoji → Semantic Versioning → push → PR (auto-invocada) |
| Command | `/commit` | Invocação explícita do fluxo de commit |

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
- `.claude/commands/commit.md` — slash command `/commit`
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
A IA detecta automaticamente quando usar a skill de git:
```
"commita o que foi feito"
"faz o commit e abre uma PR"
"registra as mudanças"
"sobe as alterações"
```

### Via slash command
```
/commit
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
│   └── git-commit/
│       └── SKILL.md         # Definição da skill
├── agents/                  # Subagentes especializados (nenhum no momento)
├── commands/
│   └── commit.md            # Slash command /commit
├── mcp-server/              # Servidor MCP (TypeScript, publicável no npm)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       └── tools/
│           └── index.ts
├── install.sh               # Script de instalação
└── uninstall.sh             # Script de remoção
```
