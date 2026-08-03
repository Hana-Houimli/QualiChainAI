import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';
import { navItems } from '../../routes/navConfig';
import { useUiStore } from '../../store/useUiStore';
import { cn } from '../../utils/cn';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 76 : 264 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-surface-border bg-surface-sidebar dark:border-dark-border dark:bg-dark-sidebar lg:flex"
    >
      <div className="flex h-16 items-center gap-3 border-b border-surface-border px-5 dark:border-dark-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow-primary">
          <Icon name="ShieldCheck" size={20} />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold leading-tight text-ink-primary dark:text-dark-text">QualiChain AI</p>
            <p className="truncate text-[11px] leading-tight text-ink-secondary dark:text-dark-subtext">by PharmaLink</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100'
                  : 'text-ink-secondary hover:bg-slate-50 dark:text-dark-subtext dark:hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={item.icon}
                  size={19}
                  className={cn('shrink-0', isActive ? 'text-primary dark:text-primary-100' : 'text-ink-secondary dark:text-dark-subtext')}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className="ml-auto rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-border p-3 dark:border-dark-border">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-slate-50 dark:text-dark-subtext dark:hover:bg-white/5"
        >
          <Icon name={sidebarCollapsed ? 'PanelLeftOpen' : 'PanelLeftClose'} size={18} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
