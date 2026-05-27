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

### git-commit

| Campo | Valor |
|-------|-------|
| **ID** | `git-commit` |
| **Arquivo** | `skills/git-commit/SKILL.md` |
| **Comando explícito** | `/commit` |
| **Modelo** | padrão (herda do contexto) |
| **Tools permitidas** | `Bash` |

**Gatilhos automáticos** — A IA invoca esta skill quando o usuário pede:
- Commitar mudanças ("commita", "faz o commit", "registra as mudanças")
- Push para o remoto ("sobe as alterações", "faz o push")
- Abrir Pull Request ("abre PR", "cria a PR")
- Qualquer variação do fluxo git: branch → commit → push → PR

**Fluxo executado (8 etapas):**

| Etapa | Ação |
|-------|------|
| 1 | Verifica estado do repositório (`git status`, `git diff`) |
| 2 | Cria branch descritiva se estiver em `main` |
| 3 | Agrupa mudanças por contexto/domínio |
| 4 | Gera mensagens Gitmoji em português no imperativo |
| 5 | Executa os commits agrupados |
| 6 | Semantic Versioning (MAJOR/MINOR/PATCH) com confirmação |
| 7 | Push da branch e tag (se aplicável) |
| 8 | Abre ou atualiza Pull Request via `gh` |

**Tabela Gitmoji:**

| Emoji | Tipo | Quando usar |
|-------|------|-------------|
| ✨ | feat | Nova funcionalidade |
| 🐛 | fix | Correção de bug |
| ♻️ | refactor | Refatoração |
| ✅ | test | Testes |
| 📝 | docs | Documentação |
| 🔧 | chore | Configuração |
| 📦 | chore | Dependências |
| 🚀 | ci | Deploy / CI/CD |
| 💄 | style | UI / estilos |
| 🔒 | security | Segurança |
| ⚡️ | perf | Performance |
| 🚑 | hotfix | Hotfix crítico |

---

## Agents (Subagentes Especializados)

Nenhum agent registrado no momento.

---

## Commands (Slash Commands)

Comandos invocados explicitamente pelo usuário com `/`.

### /commit

| Campo | Valor |
|-------|-------|
| **ID** | `commit` |
| **Arquivo** | `commands/commit.md` |
| **Uso** | `/commit` |

Executa o fluxo completo de git: inspeciona mudanças, cria branch, agrupa commits Gitmoji, versionamento semântico, push e PR.

**Exemplos de uso**:
```
/commit
```

---

## MCP Tools (Execução de Código Real)

Nenhuma MCP tool registrada no momento.

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
