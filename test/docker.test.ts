import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

describe('Devcontainer and Docker Integration', () => {
  it('includes valid devcontainer.json configuration', () => {
    const devcontainerPath = path.resolve('.devcontainer/devcontainer.json');
    expect(fs.existsSync(devcontainerPath)).toBe(true);

    const content = fs.readFileSync(devcontainerPath, 'utf8');
    const json = JSON.parse(content);
    expect(json.name).toBe('Covpages Development Container');
    expect(json.image).toContain('typescript-node');
    expect(json.postCreateCommand).toContain('npm install');
  });

  it('provides multi-stage production Dockerfile', () => {
    const dockerfilePath = path.resolve('Dockerfile');
    expect(fs.existsSync(dockerfilePath)).toBe(true);

    const dockerfile = fs.readFileSync(dockerfilePath, 'utf8');
    expect(dockerfile).toContain('AS builder');
    expect(dockerfile).toContain('AS runner');
    expect(dockerfile).toContain('ENTRYPOINT');
  });

  it('provides executable docker wrapper script with diagnostic fallbacks', () => {
    const scriptPath = path.resolve('bin/covpages-docker.sh');
    expect(fs.existsSync(scriptPath)).toBe(true);

    // Verify file has execute permissions
    const stats = fs.statSync(scriptPath);
    expect(stats.mode & 0o111).toBeTruthy();

    // Run script: when docker is absent, it prints helpful instructions
    const result = spawnSync(scriptPath, ['--help'], { encoding: 'utf8' });
    if (!result.error && result.stderr) {
      expect(result.stderr).toContain('Neither \'docker\' nor \'podman\' was found in your PATH');
      expect(result.stderr).toContain('https://docs.docker.com/get-docker/');
    }
  });

  it('exposes docker command in CLI help output', () => {
    const cliPath = path.resolve('bin/covpages.js');
    const result = spawnSync('node', [cliPath, '--help'], { encoding: 'utf8' });
    expect(result.stdout).toContain('docker');
    expect(result.stdout).toContain('inside a container');
  });
});
