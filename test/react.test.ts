import { describe, it, expect } from 'vitest';
import { createCovpagesState, mountCovpages } from '../src/react/index.js';

describe('React / Component Architecture Integration', () => {
  it('creates reactive Covpages state manager', () => {
    const store = createCovpagesState(null, { initialTab: 'trends' });
    let state = store.getState();
    expect(state.activeTab).toBe('trends');
    expect(state.sidebarVisible).toBe(true);

    store.getState().setActiveTab('files');
    state = store.getState();
    expect(state.activeTab).toBe('files');

    store.getState().setCurrentFolder('src/parsers');
    state = store.getState();
    expect(state.currentFolder).toBe('src/parsers');
    expect(state.selectedFile).toBe(null);

    store.getState().setSelectedFile('src/index.ts');
    state = store.getState();
    expect(state.selectedFile).toBe('src/index.ts');
  });

  it('notifies subscribers on state changes', () => {
    const store = createCovpagesState();
    let callCount = 0;
    const unsubscribe = store.subscribe(() => {
      callCount++;
    });

    store.getState().setTheme('dark');
    expect(callCount).toBe(1);
    expect(store.getState().theme).toBe('dark');

    unsubscribe();
    store.getState().setTheme('light');
    expect(callCount).toBe(1);
  });

  it('mounts and destroys clean container elements', () => {
    const dummyElement = {
      className: '',
      attributes: {} as Record<string, string>,
      innerHTML: '<span>content</span>',
      setAttribute(k: string, v: string) {
        this.attributes[k] = v;
      },
    };

    const instance = mountCovpages(dummyElement as unknown as HTMLElement, { theme: 'dark', className: 'custom-view' });
    expect(dummyElement.attributes['data-color-mode']).toBe('dark');
    expect(dummyElement.className).toContain('custom-view');

    instance.update({ theme: 'light' });
    expect(dummyElement.attributes['data-color-mode']).toBe('light');

    instance.destroy();
    expect(dummyElement.innerHTML).toBe('');
  });
});
