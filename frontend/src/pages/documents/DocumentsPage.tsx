import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { documents } from '../../services/mockData';
import { cn } from '../../utils/cn';

const folders = [
  { name: 'SOPs', count: 42, icon: 'FolderCog' },
  { name: 'Policies', count: 18, icon: 'FolderKanban' },
  { name: 'Forms', count: 26, icon: 'FolderInput' },
  { name: 'Reports', count: 63, icon: 'FolderOutput' },
  { name: 'Certificates', count: 9, icon: 'FolderCheck' },
];

const typeTone: Record<string, 'neutral' | 'info' | 'primary' | 'warning' | 'success'> = {
  SOP: 'primary', Policy: 'info', Form: 'neutral', Report: 'success', Certificate: 'warning',
};

export default function DocumentsPage() {
  const [query, setQuery] = useState('');
  const filtered = documents.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion documentaire"
        description="Contrôle de version, validation et cycle de vie des documents qualité"
        actions={<Button variant="primary"><Icon name="Upload" size={16} /> Importer un document</Button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {folders.map((f) => (
          <button key={f.name} className="flex flex-col items-start gap-3 rounded-2xl border border-surface-border bg-surface-card p-4 text-left transition-shadow hover:shadow-elevated dark:border-dark-border dark:bg-dark-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary/15 dark:text-primary-100">
              <Icon name={f.icon} size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary dark:text-dark-text">{f.name}</p>
              <p className="text-xs text-ink-secondary dark:text-dark-subtext">{f.count} fichiers</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Icon name="Search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary dark:text-dark-subtext" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un document…"
            className="h-10 w-full rounded-xl border border-surface-border bg-surface-card pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
          />
        </div>
        <Button variant="outline" size="md"><Icon name="Filter" size={16} /> Filtres</Button>
        <Button variant="outline" size="md"><Icon name="ArrowDownUp" size={16} /> Trier</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doc) => (
          <Card key={doc.id} className="p-5 transition-shadow hover:shadow-elevated">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-ink-secondary dark:bg-white/5 dark:text-dark-subtext">
                <Icon name="FileText" size={19} />
              </div>
              <Badge tone={typeTone[doc.type]}>{doc.type}</Badge>
            </div>
            <p className="mt-3 line-clamp-2 text-sm font-semibold text-ink-primary dark:text-dark-text">{doc.name}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-ink-secondary dark:text-dark-subtext">
              <span className="font-mono">{doc.version}</span>
              <span>·</span>
              <span>{doc.owner}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge tone={doc.status === 'approved' ? 'success' : doc.status === 'expired' ? 'danger' : doc.status === 'in_review' ? 'warning' : 'neutral'}>
                {doc.status.replace('_', ' ')}
              </Badge>
              <span className={cn('text-xs', doc.status === 'expired' && 'font-semibold text-danger')}>
                {doc.expiresAt ? `Expire ${new Date(doc.expiresAt).toLocaleDateString('fr-FR')}` : `Modifié ${new Date(doc.updatedAt).toLocaleDateString('fr-FR')}`}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
