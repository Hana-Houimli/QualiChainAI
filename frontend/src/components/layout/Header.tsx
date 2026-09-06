import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { useUiStore } from '../../store/useUiStore';
import { cn } from '../../utils/cn';

export function Header() {
  const { theme, toggleTheme } = useUiStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-border bg-surface-card/80 px-4 backdrop-blur-md dark:border-dark-border dark:bg-dark-card/80 sm:px-6">
      

      <div className="ml-auto flex items-center gap-1.5">
        <button
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-surface-border px-3 text-xs font-semibold text-ink-secondary hover:bg-slate-50 dark:border-dark-border dark:text-dark-subtext dark:hover:bg-white/5 sm:flex"
          aria-label="Changer de langue"
        >
          <Icon name="Globe" size={14} />
          FR
        </button>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5"
          aria-label="Changer de thème"
        >
          <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5"
            aria-label="Notifications"
          >
            <Icon name="Bell" size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface-card dark:ring-dark-card" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 animate-slide-up rounded-2xl border border-surface-border bg-surface-card p-2 shadow-elevated dark:border-dark-border dark:bg-dark-card">
              <p className="px-3 py-2 text-sm font-semibold text-ink-primary dark:text-dark-text">Notifications</p>
              
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
              HH
            </div>
            <span className="hidden text-sm font-medium text-ink-primary dark:text-dark-text sm:block">Hana Houimli</span>
            <Icon name="ChevronDown" size={14} className="hidden text-ink-secondary dark:text-dark-subtext sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 animate-slide-up rounded-2xl border border-surface-border bg-surface-card p-2 shadow-elevated dark:border-dark-border dark:bg-dark-card">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-ink-primary dark:text-dark-text">Hana Houimli</p>
                <p className="text-xs text-ink-secondary dark:text-dark-subtext">Administrator</p>
              </div>
              <div className="my-1 h-px bg-surface-border dark:bg-dark-border" />
              {[
                { icon: 'User', label: 'Mon profil' },
                { icon: 'Settings', label: 'Paramètres' },
                { icon: 'LogOut', label: 'Se déconnecter' },
              ].map((item) => (
                <button key={item.label} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-secondary hover:bg-slate-50 dark:text-dark-subtext dark:hover:bg-white/5">
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
