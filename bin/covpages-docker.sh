#!/usr/bin/env bash
# ==============================================================================
# covpages-docker: Zero-dependency Docker wrapper CLI for Covpages
#
# Runs covpages inside a lightweight, secure container without requiring
# Node.js or npm to be installed on the host machine.
# ==============================================================================

set -e

# Detect container runtime (docker or podman)
if command -v docker >/dev/null 2>&1; then
  CONTAINER_RUNTIME="docker"
elif command -v podman >/dev/null 2>&1; then
  CONTAINER_RUNTIME="podman"
else
  echo "❌ Error: Neither 'docker' nor 'podman' was found in your PATH." >&2
  echo "" >&2
  echo "To use the Docker-wrapper CLI, please install:" >&2
  echo "  • Docker: https://docs.docker.com/get-docker/" >&2
  echo "  • Podman: https://podman.io/getting-started/installation" >&2
  echo "" >&2
  echo "Alternatively, run covpages directly using Node.js:" >&2
  echo "  npx covpages $*" >&2
  exit 1
fi

# Configuration via environment variables
COVPAGES_IMAGE="${COVPAGES_IMAGE:-ghcr.io/yongjhih/covpages:latest}"

# Handle 'build' command
if [ "$1" = "build" ]; then
  shift
  echo "🐳 Building local covpages Docker image..."
  exec "$CONTAINER_RUNTIME" build -t covpages:latest "$@" .
fi

# Handle 'pull' command
if [ "$1" = "pull" ]; then
  shift
  echo "🐳 Pulling covpages Docker image ($COVPAGES_IMAGE)..."
  exec "$CONTAINER_RUNTIME" pull "$COVPAGES_IMAGE" "$@"
fi

# Handle '--build' option to force local build before running
if [ "$1" = "--build" ]; then
  shift
  echo "🐳 Building local covpages Docker image..."
  "$CONTAINER_RUNTIME" build -t covpages:latest .
  COVPAGES_IMAGE="covpages:latest"
fi

# Configure interactive TTY flags
DOCKER_TTY_FLAGS=""
if [ -t 0 ] && [ -t 1 ]; then
  DOCKER_TTY_FLAGS="-it"
else
  DOCKER_TTY_FLAGS="-i"
fi

# Configure host user ID & group ID on POSIX to avoid root file ownership issues
DOCKER_USER_FLAGS=""
if [ "$(uname -s)" != "MINGW"* ] && [ "$(uname -s)" != "CYGWIN"* ] && [ "$(id -u)" != "0" ]; then
  DOCKER_USER_FLAGS="-u $(id -u):$(id -g)"
fi

# Git config forwarding (read-only)
DOCKER_GIT_FLAGS=""
if [ -f "$HOME/.gitconfig" ]; then
  DOCKER_GIT_FLAGS="-v $HOME/.gitconfig:/etc/gitconfig:ro"
fi

# Forward common CI environment variables
ENV_FLAGS=""
[ -n "$CI" ] && ENV_FLAGS="$ENV_FLAGS -e CI=$CI"
[ -n "$GITHUB_SHA" ] && ENV_FLAGS="$ENV_FLAGS -e GITHUB_SHA=$GITHUB_SHA"
[ -n "$GITHUB_REF" ] && ENV_FLAGS="$ENV_FLAGS -e GITHUB_REF=$GITHUB_REF"
[ -n "$GITHUB_REF_NAME" ] && ENV_FLAGS="$ENV_FLAGS -e GITHUB_REF_NAME=$GITHUB_REF_NAME"
[ -n "$GITHUB_REPOSITORY" ] && ENV_FLAGS="$ENV_FLAGS -e GITHUB_REPOSITORY=$GITHUB_REPOSITORY"
[ -n "$GIT_AUTHOR_NAME" ] && ENV_FLAGS="$ENV_FLAGS -e GIT_AUTHOR_NAME=$GIT_AUTHOR_NAME"
[ -n "$GIT_AUTHOR_EMAIL" ] && ENV_FLAGS="$ENV_FLAGS -e GIT_AUTHOR_EMAIL=$GIT_AUTHOR_EMAIL"

# Execute container
exec "$CONTAINER_RUNTIME" run --rm \
  $DOCKER_TTY_FLAGS \
  $DOCKER_USER_FLAGS \
  $DOCKER_GIT_FLAGS \
  $ENV_FLAGS \
  -v "$PWD:/workspace" \
  -w /workspace \
  "$COVPAGES_IMAGE" \
  "$@"
