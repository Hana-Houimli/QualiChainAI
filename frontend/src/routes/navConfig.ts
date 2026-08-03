import type { NavItem } from '../types';

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'AI Assistant', path: '/ai-assistant', icon: 'Sparkles', badge: 3 },
  { label: 'Audits', path: '/audits', icon: 'ClipboardCheck' },
  { label: 'Documents', path: '/documents', icon: 'FileText' },
  { label: 'CAPA', path: '/capa', icon: 'ListChecks' },
  { label: 'Risks', path: '/risks', icon: 'ShieldAlert' },
  { label: 'IoT Monitoring', path: '/iot-monitoring', icon: 'Thermometer' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { label: 'Training', path: '/training', icon: 'GraduationCap' },
  { label: 'Administration', path: '/administration', icon: 'Users' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];
