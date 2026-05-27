#!/usr/bin/env bash
# install.sh — Installs ia-shared-library into a target project or globally
#
# Usage:
#   ./install.sh                          # Install globally (~/.claude/plugins/)
#   ./install.sh --project /path/to/repo  # Install into a specific project
#   ./install.sh --help

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="ia-shared-library"
TARGET_PROJECT=""
MODE="global"

print_usage() {
  echo "Usage:"
  echo "  ./install.sh                          # Install globally"
  echo "  ./install.sh --project /path/to/repo  # Install into a specific project"
  echo "  ./install.sh --help"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      TARGET_PROJECT="$2"
      MODE="project"
      shift 2
      ;;
    --help|-h)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
done

install_global() {
  local plugin_dir="$HOME/.claude/plugins/$PLUGIN_NAME"
  echo "Installing globally to: $plugin_dir"

  if [[ -L "$plugin_dir" ]]; then
    echo "  Removing existing symlink..."
    rm "$plugin_dir"
  elif [[ -d "$plugin_dir" ]]; then
    echo "  Removing existing directory..."
    rm -rf "$plugin_dir"
  fi

  ln -s "$SCRIPT_DIR" "$plugin_dir"
  echo "  Plugin symlinked."

  echo ""
  echo "Done! The following are now available globally in Claude Code:"
  echo "  Skills:   git-commit (auto-invoked)"
  echo "  Commands: /commit"
  echo ""
  echo "To also enable MCP tools, add to ~/.claude/settings.json:"
  cat << EOF
  "mcpServers": {
    "ia-tools": {
      "command": "node",
      "args": ["$SCRIPT_DIR/mcp-server/dist/index.js"]
    }
  }
EOF
}

install_project() {
  local project="$TARGET_PROJECT"

  if [[ ! -d "$project" ]]; then
    echo "Error: Project directory does not exist: $project"
    exit 1
  fi

  echo "Installing into project: $project"

  # Create .claude/commands directory
  local commands_dir="$project/.claude/commands"
  mkdir -p "$commands_dir"

  # Symlink commands
  for cmd_file in "$SCRIPT_DIR"/commands/*.md; do
    local cmd_name
    cmd_name="$(basename "$cmd_file")"
    if [[ -L "$commands_dir/$cmd_name" ]]; then
      rm "$commands_dir/$cmd_name"
    fi
    ln -s "$cmd_file" "$commands_dir/$cmd_name"
    echo "  Linked command: $cmd_name"
  done

  # Configure MCP in project
  local mcp_file="$project/.mcp.json"
  local mcp_entry
  mcp_entry=$(cat << EOF
{
  "mcpServers": {
    "ia-tools": {
      "command": "node",
      "args": ["$SCRIPT_DIR/mcp-server/dist/index.js"]
    }
  }
}
EOF
)

  if [[ -f "$mcp_file" ]]; then
    echo "  .mcp.json already exists — add manually if needed:"
    echo '    "ia-tools": { "command": "node", "args": ["'"$SCRIPT_DIR"'/mcp-server/dist/index.js"] }'
  else
    echo "$mcp_entry" > "$mcp_file"
    echo "  Created .mcp.json"
  fi

  # Create AI context file
  local context_dir="$project/.claude"
  mkdir -p "$context_dir"
  cat > "$context_dir/ia-skills-context.md" << EOF
# ia-shared-library — Installed Skills & Tools

This project has the **ia-shared-library** installed from:
\`$SCRIPT_DIR\`

## Available Resources

### Slash Commands
- \`/commit\` — Execute the full git workflow: Gitmoji commits, semantic versioning, push and PR

### Skills (auto-invoked by the AI)
- **git-commit**: Automatically activated when the user asks to commit, push, or open a PR

## Quick Reference

\`\`\`
# User asks: "commita o que foi feito"
→ git-commit skill is auto-invoked

# User asks: "faz o commit e abre uma PR"
→ git-commit skill handles the full workflow
\`\`\`

## Adding More Skills
See the full catalog: \`$SCRIPT_DIR/CATALOG.md\`
See the registry: \`$SCRIPT_DIR/registry.json\`
EOF

  echo "  Created .claude/ia-skills-context.md"

  echo ""
  echo "Done! Installation complete for: $project"
  echo ""
  echo "Make sure the MCP server is built:"
  echo "  cd $SCRIPT_DIR && npm run build"
}

# Build MCP server if not already built
if [[ ! -f "$SCRIPT_DIR/mcp-server/dist/index.js" ]]; then
  echo "Building MCP server..."
  (cd "$SCRIPT_DIR/mcp-server" && npm install --silent && npm run build --silent)
  echo "  MCP server built."
fi

if [[ "$MODE" == "global" ]]; then
  install_global
else
  install_project
fi
