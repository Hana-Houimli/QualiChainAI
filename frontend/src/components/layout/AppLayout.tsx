import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-bg dark:bg-dark-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
        >
          <Outlet />
        </motion.main>
        <footer className="hidden border-t border-surface-border px-6 py-4 text-center text-xs text-ink-secondary dark:border-dark-border dark:text-dark-subtext lg:block">
          QualiChain AI © 2026 PharmaLink · GDP/BPD Compliance Platform · v2.4.1
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}
