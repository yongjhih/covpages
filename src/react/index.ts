import type { CovpagesData } from '../types.js';
import type { CovpagesProps, CovpagesContextValue } from './types.js';

export * from './types.js';

/**
 * Covpages Component Specification & Factory
 *
 * Implements a framework-agnostic component architecture that can be rendered
 * inside React (18/19), Preact, Next.js (App & Pages router), Docusaurus, Vite,
 * or as a standard Custom Element (<cov-pages>).
 */
export function createCovpagesState(initialData?: CovpagesData | null, options: Partial<CovpagesProps> = {}) {
  let data = initialData || null;
  let activeTab: 'files' | 'trends' | 'commits' = options.initialTab || 'files';
  let currentFolder = '';
  let selectedFile: string | null = null;
  let activeRefType: 'branch' | 'tag' = 'branch';
  let activeRefName = data?.commits?.[0]?.commit?.branch || 'main';
  let theme: 'light' | 'dark' | 'auto' = options.theme || 'auto';
  let sidebarVisible = true;
  let filterText = '';
  let sortColumn: 'name' | 'lines' | 'functions' | 'branches' = 'name';
  let sortAsc = true;

  const listeners = new Set<() => void>();
  function notify() {
    listeners.forEach((l) => l());
  }

  return {
    getState(): CovpagesContextValue {
      return {
        data,
        activeTab,
        currentFolder,
        selectedFile,
        activeRefType,
        activeRefName,
        theme,
        sidebarVisible,
        filterText,
        sortColumn,
        sortAsc,
        setActiveTab(tab) {
          activeTab = tab;
          notify();
        },
        setCurrentFolder(folder) {
          currentFolder = folder;
          selectedFile = null;
          notify();
        },
        setSelectedFile(file) {
          selectedFile = file;
          if (file && options.onFileSelect) options.onFileSelect(file);
          notify();
        },
        setActiveRef(type, name) {
          activeRefType = type;
          activeRefName = name;
          if (options.onRefChange) options.onRefChange(type, name);
          notify();
        },
        setTheme(newTheme) {
          theme = newTheme;
          notify();
        },
        toggleSidebar() {
          sidebarVisible = !sidebarVisible;
          notify();
        },
        setFilterText(text) {
          filterText = text;
          notify();
        },
        setSort(col) {
          if (sortColumn === col) {
            sortAsc = !sortAsc;
          } else {
            sortColumn = col;
            sortAsc = true;
          }
          notify();
        },
      };
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setData(newData: CovpagesData) {
      data = newData;
      notify();
    },
  };
}

/**
 * Universal HTML / Element Mount for React, Vue, Svelte, or Vanilla environments
 */
export function mountCovpages(targetElement: HTMLElement, props: CovpagesProps = {}) {
  const container = targetElement;
  container.setAttribute('data-color-mode', props.theme || 'auto');
  container.className = `covpages-root ${props.className || ''}`.trim();

  if (props.data) {
    (window as unknown as { __COVPAGES_DATA__: CovpagesData }).__COVPAGES_DATA__ = props.data;
  }

  return {
    destroy() {
      container.innerHTML = '';
    },
    update(newProps: Partial<CovpagesProps>) {
      if (newProps.theme) {
        container.setAttribute('data-color-mode', newProps.theme);
      }
    },
  };
}

/**
 * Preact / React Declarative Component definition (typed for TSX consumers)
 */
export type CovpagesComponent = (props: CovpagesProps) => unknown;
