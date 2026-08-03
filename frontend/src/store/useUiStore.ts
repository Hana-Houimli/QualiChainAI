import { create } from 'zustand';

interface UiState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('qc-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useUiStore = create<UiState>((set, get) => ({
  theme: getInitialTheme(),
  sidebarCollapsed: false,
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('qc-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
