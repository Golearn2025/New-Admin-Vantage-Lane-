#!/bin/bash
# Auto-install ALL AI & Automation Extensions
# Usage: bash scripts/install-ai-extensions.sh

echo "🚀 Installing AI & Automation Extensions..."
echo ""

# Core AI Assistants
echo "📦 Installing AI Assistants..."
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat

# Real-time Validation
echo "⚡ Installing Real-time Validation..."
code --install-extension usernamehw.errorlens
code --install-extension mattpocock.ts-error-translator
code --install-extension leodevbro.blockman

# Code Quality
echo "🛡️ Installing Code Quality Tools..."
code --install-extension SonarSource.sonarlint-vscode
code --install-extension snyk-security.snyk-vulnerability-scanner
code --install-extension streetsidesoftware.code-spell-checker

# Automation
echo "🤖 Installing Automation Tools..."
code --install-extension wix.vscode-import-cost
code --install-extension meganrogge.template-string-converter
code --install-extension formulahendry.auto-rename-tag
code --install-extension stringham.move-ts
code --install-extension pmneo.tsimporter
code --install-extension christian-kohler.path-intellisense

# React & Next.js
echo "⚛️ Installing React/Next.js Tools..."
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension willstakayama.vscode-nextjs-snippets

# CSS
echo "🎨 Installing CSS Tools..."
code --install-extension stylelint.vscode-stylelint
code --install-extension vunguyentuan.vscode-css-variables
code --install-extension pranaygp.vscode-css-peek

# Comments & Docs
echo "📝 Installing Documentation Tools..."
code --install-extension aaron-bond.better-comments
code --install-extension gruntfuggly.todo-tree

# Git
echo "🔀 Installing Git Tools..."
code --install-extension eamodio.gitlens
code --install-extension mhutchie.git-graph

# Testing & API
echo "🧪 Installing Testing Tools..."
code --install-extension WallabyJs.wallaby-vscode
code --install-extension rangav.vscode-thunder-client
code --install-extension humao.rest-client

# Debug
echo "🐛 Installing Debug Tools..."
code --install-extension WallabyJs.console-ninja

echo ""
echo "✅ All extensions installed!"
echo "🔄 Restart VSCode for changes to take effect"
echo ""
echo "🎯 Next steps:"
echo "1. Restart VSCode"
echo "2. GitHub Copilot: Sign in (Cmd+Shift+P → 'Copilot: Sign In')"
echo "3. Check .vscode/settings.json for configuration"
echo "4. Start coding - AI will guide you!"
