# Covpages Dev Container

This directory provides the standard [Development Container](https://containers.dev/) configuration for developing, testing, and debugging **Covpages**.

## Quick Start

### Option 1: GitHub Codespaces
1. Navigate to the [yongjhih/covpages repository](https://github.com/yongjhih/covpages).
2. Click **Code** -> **Codespaces** tab -> **Create codespace on main**.
3. All dependencies, Node.js 22, Git, and VS Code extensions will be automatically installed and ready in seconds.

### Option 2: Visual Studio Code Dev Containers
1. Ensure [Docker Desktop](https://www.docker.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) are installed.
2. Open this repository folder in VS Code.
3. Click the notification **"Reopen in Container"** or press `F1` / `Cmd+Shift+P` and run:
   ```
   > Dev Containers: Reopen in Container
   ```

### Option 3: Dev Container CLI
```bash
npm install -g @devcontainers/cli
devcontainer open .
```

## Features Included
- **Node.js 22 LTS (Bookworm)**
- **Git & GitHub CLI (`gh`)** preconfigured
- **Docker-outside-of-Docker** for building and testing container images
- **VS Code Extensions**: Vitest Explorer, ESLint, Prettier, Coverage Gutters, GitLens
- **Automatic Setup**: Runs `npm install && npm run build` upon container creation
