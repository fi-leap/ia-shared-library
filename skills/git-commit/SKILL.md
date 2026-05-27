---
name: git-commit
description: >
  Use esta skill sempre que o usuário pedir para commitar, fazer commit, salvar
  mudanças no git, registrar alterações, abrir PR, fazer push, ou qualquer variação
  de "commita o que foi feito", "faz o commit", "registra as mudanças",
  "sobe as alterações", "abre um PR". Esta skill define o fluxo completo
  obrigatório: commits Gitmoji em português → Semantic Versioning → push → PR.
version: 1.0.0
argument-hint: <tipo de mudança>
allowed-tools: [Bash]
---

# Skill: Git Commit Inteligente com Gitmoji

## Fluxo obrigatório (execute SEMPRE nesta ordem)

### ETAPA 1 — Verificar estado do repositório

```bash
git status
git diff
git diff --staged
git branch --show-current
```

Se não houver nada para commitar, informe o usuário e encerre.

### ETAPA 2 — Criar branch (se necessário)

Verificar se está na branch `main`. Caso esteja, criar nova branch com nome que resuma de forma clara o que foi feito, separando palavras por hífen, com no máximo 3 palavras e sem caracteres especiais:

```
feat/login-oauth
fix/calculo-desconto
refactor/servico-dedicado
```

```bash
git branch --show-current
# Se estiver em main:
git checkout -b {tipo}/<nome-resumido>
```

### ETAPA 3 — Agrupar mudanças por contexto

Analise os arquivos e agrupe por domínio:

- Auth/segurança → um commit
- UI/componentes → outro commit
- Testes → outro commit
- Config/dependências → outro commit
- Documentação → outro commit

**Nunca misture contextos em um único commit.**

### ETAPA 4 — Gerar mensagens no padrão Gitmoji

Formato:

```
<emoji> <tipo>(<escopo opcional>): <descrição em português no imperativo>
```

| Emoji | Quando usar                   |
| ----- | ----------------------------- |
| ✨    | Nova funcionalidade           |
| 🐛    | Correção de bug               |
| ♻️    | Refatoração                   |
| 🎨    | Melhoria de estrutura/formato |
| ✅    | Testes                        |
| 📝    | Documentação                  |
| 🔧    | Configuração                  |
| 📦    | Dependências                  |
| 🚀    | Deploy / CI/CD                |
| 💄    | UI / estilos                  |
| 🔒    | Segurança                     |
| ⚡️    | Performance                   |
| 🗑️    | Remoção de código/arquivos    |
| 🚑    | Hotfix crítico                |
| 🩹    | Correção menor                |
| 💬    | Textos / strings / traduções  |
| 🏗️    | Mudanças arquiteturais        |
| 🌐    | Internacionalização           |

Regras:

- Português, imperativo ("adiciona", "corrige", "remove")
- Máximo 72 caracteres na primeira linha
- Corpo separado por linha em branco (quando necessário)

Exemplos válidos:

```
✨ feat(auth): adiciona login com Google OAuth
🐛 fix(carrinho): corrige cálculo de desconto para múltiplos itens
♻️ refactor(api): extrai lógica de validação para serviço dedicado
✅ test(pedidos): adiciona testes de integração para o checkout
📦 chore: atualiza dependências para versões mais recentes
💄 style(dashboard): ajusta responsividade dos cards de métricas
```

### ETAPA 5 — Executar os commits

```bash
git add <arquivos do grupo>
git commit -m "<emoji> <tipo>(<escopo>): <descrição>"
```

### ETAPA 6 — Semantic Versioning

Após todos os commits, determine se é necessário bumpar a versão com base nos tipos de commit realizados:

| Situação | Bump | Exemplo |
|---|---|---|
| Commit com `BREAKING CHANGE` no corpo ou `!` após o tipo | **MAJOR** | `1.2.3` → `2.0.0` |
| Pelo menos um commit `feat` | **MINOR** | `1.2.3` → `1.3.0` |
| Apenas `fix`, `perf`, `🚑 hotfix` | **PATCH** | `1.2.3` → `1.2.4` |
| Apenas `chore`, `docs`, `style`, `test`, `refactor`, `ci` | **nenhum** | sem alteração |

**Se nenhum bump for necessário, pule esta etapa.**

Caso contrário:

**6.1 — Ler a versão atual do `pom.xml`:**
```bash
./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout
```

**6.2 — Calcular a nova versão:**
- Remova o sufixo `-SNAPSHOT` para obter a versão base (ex: `0.0.1-SNAPSHOT` → base `0.0.1`)
- Aplique o bump seguindo `MAJOR.MINOR.PATCH`
- Apresente ao usuário: `"Versão atual: X.Y.Z → nova versão: A.B.C (PATCH/MINOR/MAJOR). Confirma?"`
- **Aguarde confirmação antes de prosseguir.**

**6.3 — Atualizar `pom.xml`:**
```bash
./mvnw versions:set -DnewVersion=<nova-versão> -DgenerateBackupPoms=false
```

**6.4 — Commit da versão:**
```bash
git add pom.xml
git commit -m "🔖 chore(release): bump versão X.Y.Z → A.B.C"
```

**6.5 — Criar tag:**
```bash
git tag v<nova-versão>
```

### ETAPA 7 — Push

```bash
# Push da branch
git push origin <branch-atual>
# Se branch nova (sem upstream):
git push --set-upstream origin <branch-atual>

# Push da tag (se versão foi bumpeada)
git push origin v<nova-versão>
```

Se push falhar por divergência, informe o usuário. **Não force push sem autorização explícita.**

### ETAPA 8 — Abrir Pull Request

Verificar se já existe PR aberta para essa branch:

```bash
gh pr list --head "<branch-atual>"
```

Se já existir, informe o usuário que o push foi realizado e retorne o link. Se não existir, crie:

```bash
gh pr create \
  --title "<emoji> <título claro>" \
  --body "<descrição organizada>" \
  --base main
```

Ao final, exiba o resumo:

```bash
git log --oneline -10
```

Informe: commits realizados, versão bumpeada (se aplicável), tag criada (se aplicável), push concluído e link do PR.

---

## Regras absolutas

- ❌ Nunca use mensagens vagas: "update", "changes", "fix", "wip"
- ❌ Nunca misture contextos em um commit
- ❌ Nunca commite arquivos sensíveis (`.env`, `*.key`, `secrets.*`)
- ❌ Nunca force push sem autorização explícita
- ✅ Sempre pergunte antes de ações destrutivas
