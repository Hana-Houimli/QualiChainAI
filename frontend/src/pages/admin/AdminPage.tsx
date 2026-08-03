import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/shared/DataTable';

interface UserRow { id: string; name: string; email: string; role: string; site: string; status: 'active' | 'inactive'; }

const users: UserRow[] = [
  { id: 'u1', name: 'Omar Hafoudhi', email: 'o.hafoudhi@pharmalink.com', role: 'QA Manager', site: 'Tunis', status: 'active' },
  { id: 'u2', name: 'Julie Dupont', email: 'j.dupont@pharmalink.com', role: 'Auditor', site: 'Lyon', status: 'active' },
  { id: 'u3', name: 'Farah El Amrani', email: 'f.elamrani@pharmalink.com', role: 'Warehouse Supervisor', site: 'Casablanca', status: 'active' },
  { id: 'u4', name: 'Luis Garcia', email: 'l.garcia@pharmalink.com', role: 'Quality Analyst', site: 'Madrid', status: 'inactive' },
  { id: 'u5', name: 'Marco Haddad', email: 'm.haddad@pharmalink.com', role: 'Logistics Manager', site: 'Tunis', status: 'active' },
];

const columns: Column<UserRow>[] = [
  { header: 'Utilisateur', accessor: (r) => (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
        {r.name.split(' ').map((n) => n[0]).join('')}
      </div>
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-ink-secondary dark:text-dark-subtext">{r.email}</p>
      </div>
    </div>
  ) },
  { header: 'Rôle', accessor: (r) => <Badge tone="neutral">{r.role}</Badge> },
  { header: 'Site', accessor: (r) => r.site },
  { header: 'Statut', accessor: (r) => <Badge tone={r.status === 'active' ? 'success' : 'neutral'} dot>{r.status === 'active' ? 'Actif' : 'Inactif'}</Badge> },
  { header: '', accessor: () => <button className="text-ink-secondary hover:text-primary"><Icon name="MoreVertical" size={16} /></button> },
];

const logs = [
  { icon: 'LogIn', text: 'Omar Hafoudhi s\'est connecté', time: 'il y a 10 min' },
  { icon: 'UserPlus', text: 'Nouvel utilisateur créé: Luis Garcia', time: 'il y a 2 h' },
  { icon: 'ShieldCheck', text: 'Permissions modifiées pour le rôle Auditor', time: 'il y a 1 jour' },
  { icon: 'FileEdit', text: 'Configuration système mise à jour', time: 'il y a 3 jours' },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Utilisateurs, permissions, rôles et journaux système"
        actions={<Button variant="primary"><Icon name="UserPlus" size={16} /> Ajouter un utilisateur</Button>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable columns={columns} data={users} />
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface-card p-5 dark:border-dark-border dark:bg-dark-card">
          <h3 className="text-sm font-semibold text-ink-primary dark:text-dark-text">Journal d'activité</h3>
          <div className="mt-4 space-y-4">
            {logs.map((l, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100">
                  <Icon name={l.icon} size={14} />
                </div>
                <div>
                  <p className="text-sm text-ink-primary dark:text-dark-text">{l.text}</p>
                  <p className="text-xs text-ink-secondary dark:text-dark-subtext">{l.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
