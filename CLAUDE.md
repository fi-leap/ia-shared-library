# ia-shared-library — Guia para IAs

Este repositório é uma **biblioteca central de skills, agents e tools** para projetos Claude Code. Qualquer IA trabalhando aqui ou em um projeto que instalou esta biblioteca deve ler este guia.

---

## Se você está trabalhando NESTE repositório

### Estrutura
```
ia/
├── .claude-plugin/plugin.json   # Metadados do plugin
├── .mcp.json                    # MCP server local
├── skills/                      # Skills auto-invocáveis
├── agents/                      # Subagentes especializados
├── commands/                    # Slash commands
├── mcp-server/                  # MCP server (TypeScript)
├── CATALOG.md                   # Catálogo completo de recursos
├── registry.json                # Registro machine-readable
├── install.sh                   # Script de instalação
└── uninstall.sh                 # Script de remoção
```

### Como adicionar uma nova Skill

1. Crie o diretório: `skills/<nome-da-skill>/`
2. Crie `skills/<nome-da-skill>/SKILL.md` com este frontmatter:

```yaml
---
name: <nome-kebab-case>
description: >
  Use this skill when... (descreva QUANDO invocar, com exemplos de frases do usuário)
version: 1.0.0
argument-hint: <argumento opcional>
allowed-tools: [Bash]   # ou outros tools necessários
---

# Título da Skill

Conteúdo com instruções para a IA...
```

3. Se precisar de scripts auxiliares: `skills/<nome>/scripts/<script>.js`
4. Adicione ao `registry.json` na seção `skills`
5. Documente no `CATALOG.md`

### Como adicionar um novo Agent

1. Crie `agents/<nome>.md`:

```yaml
---
name: <nome>
description: >
  When to spawn this agent... (condições de delegação)
model: sonnet   # ou opus, haiku
---

# Agent Instructions

Instruções detalhadas para o agente...
```

2. Registre em `registry.json` na seção `agents`

### Como adicionar um novo MCP Tool

1. Crie ou edite `mcp-server/src/tools/<categoria>.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerMinhasTools(server: McpServer): void {
  server.tool(
    "nome_da_tool",
    "Descrição clara do que faz",
    {
      param1: z.string().describe("Descrição do parâmetro"),
    },
    async ({ param1 }) => {
      // implementação
      return { content: [{ type: "text", text: resultado }] };
    }
  );
}
```

2. Importe e registre em `mcp-server/src/tools/index.ts`
3. Execute `npm run build` para compilar
4. Documente no `CATALOG.md` e `registry.json`

### Convenções de nomenclatura
- Skills: `kebab-case` (ex: `git-commit`, `text-processing`)
- Agents: `kebab-case` + sufixo `-agent` (ex: `git-agent`)
- MCP tools: `snake_case` (ex: `run_command`, `fetch_url`)
- Arquivos TypeScript: `camelCase.ts`

### Build e teste

```bash
# Instalar dependências e compilar MCP server
npm run build

# Testar MCP server localmente
npm start
```

---

## Se você está em um repositório que instalou esta biblioteca

Verifique `.claude/ia-skills-context.md` para instruções específicas do projeto.

Para o catálogo completo de recursos disponíveis, leia:
`/home/filipe/Documents/projects/ia/CATALOG.md`

Para referência machine-readable:
`/home/filipe/Documents/projects/ia/registry.json`

### Verificar o que está instalado

```bash
# Verificar se MCP server está configurado
cat .mcp.json | grep "ia-tools"

# Verificar se commands estão instalados
ls .claude/commands/

# Verificar context file
cat .claude/ia-skills-context.md
```

### Invocar skills disponíveis

**Git Commit**:
- Automaticamente: peça para commitar, fazer push ou abrir PR em linguagem natural
- Explicitamente: `/commit`

---

## Princípios de Design

1. **Cada skill tem uma responsabilidade clara** — nomes e gatilhos não devem se sobrepor
2. **MCP tools fazem execução real** — skills fazem raciocínio; tools fazem cômputo preciso
3. **Documentação é first-class** — toda adição deve ser documentada no `CATALOG.md` e `registry.json`
4. **Compatibilidade com marketplace** — manter estrutura de plugin válida em `.claude-plugin/plugin.json`
