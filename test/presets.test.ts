import { describe, it, expect } from 'vitest';
import { FRAMEWORK_PRESETS, getPreset, generatePresetWorkflow } from '../src/core/presets.js';

describe('Framework Presets', () => {
  it('contains mainstream framework presets', () => {
    expect(FRAMEWORK_PRESETS.flutter).toBeDefined();
    expect(FRAMEWORK_PRESETS.vitest).toBeDefined();
    expect(FRAMEWORK_PRESETS.jest).toBeDefined();
    expect(FRAMEWORK_PRESETS.rust).toBeDefined();
    expect(FRAMEWORK_PRESETS.python).toBeDefined();
    expect(FRAMEWORK_PRESETS.go).toBeDefined();
  });

  it('retrieves preset with case-insensitive matching', () => {
    const flutter = getPreset('Flutter');
    expect(flutter).toBeDefined();
    expect(flutter?.testCmd).toContain('flutter test');

    const rust = getPreset('RUST');
    expect(rust).toBeDefined();
    expect(rust?.testCmd).toContain('cargo llvm-cov');
  });

  it('generates framework-specific GitHub Actions workflows', () => {
    const flutterWf = generatePresetWorkflow('flutter');
    expect(flutterWf).toContain('subosito/flutter-action');
    expect(flutterWf).toContain('flutter test --coverage');
    expect(flutterWf).toContain('coverage/lcov.info');

    const rustWf = generatePresetWorkflow('rust');
    expect(rustWf).toContain('cargo-llvm-cov');
  });
});
