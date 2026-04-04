# Covpages Devcontainer & Docker-Wrapper CLI Guide

## 1. Overview

Covpages provides full, first-class container support for two distinct workflows:
1. **Cloud & Local Development Containers (`.devcontainer/`)**: Preconfigured environment for Visual Studio Code and GitHub Codespaces with Node.js 22, Git, test runners, and extensions.
2. **Docker-Wrapper CLI (`covpages-docker`)**: Run Covpages inside a lightweight, secure container without installing Node.js or npm on your host machine.

---

## 2. Devcontainer Specification (`.devcontainer/`)

The repository includes a ready-to-use Dev Container configuration conforming to the [Development Containers Specification](https://containers.dev/).

### 2.1 Opening in GitHub Codespaces
1. Open the [yongjhih/covpages repository](https://github.com/yongjhih/covpages).
2. Click **Code** -> **Codespaces** -> **Create codespace on main**.
3. The environment will automatically boot with Node.js 22 LTS, Git, and all development tooling.

### 2.2 Opening in Visual Studio Code
1. Install [Docker Desktop](https://www.docker.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Open the project folder in VS Code.
3. When prompted, click **"Reopen in Container"** (or run `Cmd+Shift+P` -> `Dev Containers: Reopen in Container`).

### 2.3 Included Devcontainer Features:
- **Base Image**: `mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm`
- **Features**:
  - `git:1` and `github-cli:1` pre-authenticated
  - `docker-outside-of-docker:1` for container-in-container testing
- **Extensions**: Vitest Explorer, ESLint, Prettier, Coverage Gutters, GitLens
- **Lifecycle Hook**: Automatically executes `npm install && npm run build` on startup.

---

## 3. Docker-Wrapper CLI (`covpages-docker`)

The Docker-Wrapper CLI allows you to execute Covpages on any machine with Docker or Podman installed, requiring zero local Node.js setup.

### 3.1 Quick Usage

Run using the wrapper script directly:

```bash
# Generate report for current repo using Docker
./bin/covpages-docker.sh generate --input coverage/lcov.info --output docs/covpages

# Or if installed via npm / npx
npx covpages-docker generate --input coverage/lcov.info --output docs/covpages
```

Or run via the main CLI:

```bash
npx covpages docker generate --input coverage/lcov.info --output docs/covpages
```

### 3.2 How the Wrapper Works Under the Hood

The wrapper script automatically orchestrates the following:
1. **Container Engine Detection**: Automatically detects whether `docker` or `podman` is available in your `$PATH`.
2. **Current Directory Volume Mount**: Mounts `$PWD` to `/workspace` and sets working directory to `/workspace`.
3. **Permission Mapping**: Injects `-u $(id -u):$(id -g)` on Linux and macOS so that all generated files (`index.html`, `badges/`, `history/`) match your host user permissions rather than `root`.
4. **CI Environment Forwarding**: Passes through `GITHUB_SHA`, `GITHUB_REF_NAME`, `GITHUB_REPOSITORY`, and `CI` environment variables to preserve Git commit and branch detection.
5. **Interactive TTY**: Detects whether you are in an interactive terminal and attaches `-it` flags accordingly.

### 3.3 Available Commands & Flags

| Command / Flag | Description |
| :--- | :--- |
| `covpages-docker build` | Builds the local image as `covpages:latest` using the root `Dockerfile` |
| `covpages-docker pull` | Pulls the latest official image from `ghcr.io/yongjhih/covpages:latest` |
| `covpages-docker --build [args...]` | Rebuilds the local Docker image before executing the arguments |
| `covpages-docker generate [args...]` | Runs `covpages generate` inside the container |
| `covpages-docker init` | Generates `.github/workflows/covpages.yml` inside the container |
| `covpages-docker presets <framework>` | Displays framework integration guide inside the container |

---

## 4. Using the Dockerfile in CI/CD Pipelines

For CI environments where Node.js is not installed (e.g. Python, Go, Rust, or C++ runners), you can invoke the container directly:

### 4.1 GitHub Actions (Container Action)

```yaml
- name: Run Tests
  run: pytest --cov=src --cov-report=lcov:coverage/lcov.info

- name: Generate Covpages Report via Docker
  run: |
    docker run --rm \
      -v "${{ github.workspace }}:/workspace" \
      -w /workspace \
      -e GITHUB_SHA="${{ github.sha }}" \
      -e GITHUB_REF_NAME="${{ github.ref_name }}" \
      ghcr.io/yongjhih/covpages:latest generate \
        --input coverage/lcov.info \
        --output docs/covpages
```

### 4.2 GitLab CI

```yaml
coverage_report:
  stage: deploy
  image: ghcr.io/yongjhih/covpages:latest
  script:
    - covpages generate --input coverage/lcov.info --output public
  artifacts:
    paths:
      - public
```
