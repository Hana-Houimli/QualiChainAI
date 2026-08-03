import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

const mobileItems = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Audits', path: '/audits', icon: 'ClipboardCheck' },
  { label: 'AI', path: '/ai-assistant', icon: 'Sparkles' },
  { label: 'CAPA', path: '/capa', icon: 'ListChecks' },
  { label: 'More', path: '/settings', icon: 'MoreHorizontal' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-surface-border bg-surface-card/95 backdrop-blur-md dark:border-dark-border dark:bg-dark-card/95 lg:hidden">
      {mobileItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium',
              isActive ? 'text-primary' : 'text-ink-secondary dark:text-dark-subtext'
            )
          }
        >
          <Icon name={item.icon} size={20} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
