#!/usr/bin/env bash
# uninstall.sh — Removes ia-shared-library installation
#
# Usage:
#   ./uninstall.sh                          # Remove global installation
#   ./uninstall.sh --project /path/to/repo  # Remove from a specific project

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="ia-shared-library"
TARGET_PROJECT=""
MODE="global"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      TARGET_PROJECT="$2"
      MODE="project"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [[ "$MODE" == "global" ]]; then
  local_path="$HOME/.claude/plugins/$PLUGIN_NAME"
  if [[ -L "$local_path" ]]; then
    rm "$local_path"
    echo "Removed global symlink: $local_path"
  elif [[ -d "$local_path" ]]; then
    rm -rf "$local_path"
    echo "Removed global plugin directory: $local_path"
  else
    echo "No global installation found at: $local_path"
  fi
else
  project="$TARGET_PROJECT"
  commands_dir="$project/.claude/commands"

  for cmd_file in "$SCRIPT_DIR"/commands/*.md; do
    cmd_name="$(basename "$cmd_file")"
    link="$commands_dir/$cmd_name"
    if [[ -L "$link" ]]; then
      rm "$link"
      echo "Removed: $link"
    fi
  done

  context_file="$project/.claude/ia-skills-context.md"
  if [[ -f "$context_file" ]]; then
    rm "$context_file"
    echo "Removed: $context_file"
  fi

  echo "Done. Note: .mcp.json was NOT modified — remove the 'ia-tools' entry manually if needed."
fi
