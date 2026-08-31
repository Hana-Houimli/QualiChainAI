import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Icon } from '../../components/ui/Icon';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useUiStore } from '../../store/useUiStore';
import { cn } from '../../utils/cn';

const tabs = [
  { key: 'profile', label: 'Profil', icon: 'User' },
  { key: 'organization', label: 'Organisation', icon: 'Building2' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell' },
  { key: 'appearance', label: 'Apparence', icon: 'Palette' },
  { key: 'security', label: 'Sécurité', icon: 'Lock' },
];

export default function SettingsPage() {
  const [active, setActive] = useState('appearance');
  const { theme, toggleTheme } = useUiStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Paramètres" description="Gérez votre profil, votre organisation et vos préférences" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active === t.key
                  ? 'bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100'
                  : 'text-ink-secondary hover:bg-slate-50 dark:text-dark-subtext dark:hover:bg-white/5'
              )}
            >
              <Icon name={t.icon} size={17} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3">
          {active === 'appearance' && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-ink-primary dark:text-dark-text">Thème</h3>
              <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">Choisissez l'apparence de l'interface QualiChain AI.</p>
              <div className="mt-4 flex gap-3">
                {(['light', 'dark'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => { if (theme !== mode) toggleTheme(); }}
                    className={cn(
                      'flex w-40 flex-col gap-2 rounded-2xl border-2 p-3 transition-colors',
                      theme === mode ? 'border-primary' : 'border-surface-border dark:border-dark-border'
                    )}
                  >
                    <div className={cn('h-16 w-full rounded-lg', mode === 'light' ? 'bg-slate-100' : 'bg-slate-800')} />
                    <span className="text-xs font-medium capitalize text-ink-primary dark:text-dark-text">{mode === 'light' ? 'Clair' : 'Sombre'}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {active === 'profile' && (
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">HH</div>
                <div>
                  <p className="text-sm font-semibold text-ink-primary dark:text-dark-text">Hana Houimli</p>
                  <p className="text-xs text-ink-secondary dark:text-dark-subtext">Administrator</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['Nom complet', 'Email professionnel', 'Fonction', 'Site rattaché'].map((label) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-ink-secondary dark:text-dark-subtext">{label}</label>
                    <input className="mt-1 h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text" defaultValue="" placeholder={label} />
                  </div>
                ))}
              </div>
              <Button className="mt-6" size="md">Enregistrer les modifications</Button>
            </Card>
          )}

          {(active === 'organization' || active === 'notifications' || active === 'security') && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold capitalize text-ink-primary dark:text-dark-text">{tabs.find((t) => t.key === active)?.label}</h3>
              <p className="mt-2 text-sm text-ink-secondary dark:text-dark-subtext">
                Cette section vous permet de gérer les paramètres liés à {tabs.find((t) => t.key === active)?.label.toLowerCase()}.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
