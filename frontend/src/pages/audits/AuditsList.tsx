import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/shared/DataTable';
import { audits as initialAudits } from '../../services/mockData';
import type { AuditItem, AuditType } from '../../types';

const columns: Column<AuditItem>[] = [
  { header: 'Référence', accessor: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.reference}</span> },
  { header: 'Titre', accessor: (r) => <span className="font-medium">{r.title}</span> },
  { header: 'Site', accessor: (r) => r.site },
  { header: 'Type', accessor: (r) => <Badge tone="neutral">{r.type}</Badge> },
  { header: 'Auditeur', accessor: (r) => r.auditor },
  { header: 'Score', accessor: (r) => r.score ? `${r.score}%` : '—' },
  { header: 'Date', accessor: (r) => new Date(r.date).toLocaleDateString('fr-FR') },
  { header: 'Statut', accessor: (r) => <StatusBadge status={r.status} /> },
];

const auditTypes: AuditType[] = [
  'Audit Chaîne du froid',
  'Audit Distributeur',
  'Audit Entrepôt',
  'Audit Fournisseur',
  'Audit Réglementaire',
  'Audit Système Qualité',
  'Audit Transport',
];

const SITES_PHARMACEUTIQUES = [

    "Dépôt central Tunis",
    "Entrepôt Ariana",
    "Centre de distribution Sousse",
    "Plateforme logistique Sfax",
    "Entrepôt frigorifique Monastir",
    "Grossiste répartiteur Nord",
    "Grossiste répartiteur Sud",
    "Sous-traitant transport pharmaceutique",
    "Fournisseur médicaments",
    "Fournisseur dispositifs médicaux",
    "Site de stockage vaccins",
    "Pharmacie hospitalière",
    "Centre de distribution régional",
    "Entrepôt produits thermosensibles",
    "Prestataire logistique GDP"

];

const defaultForm = {
  type: auditTypes[0],
  site: 'Tunis',
  auditor: 'Hana Houimli',
  date: '',
};

export default function AuditsList() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isCreating, setIsCreating] = useState(false);
  const [auditItems, setAuditItems] = useState<AuditItem[]>(initialAudits);
  const [formData, setFormData] = useState(defaultForm);

  const siteOptions = SITES_PHARMACEUTIQUES ;
  const auditorOptions = ['Hana Houimli', 'S. Ben Amor', 'J. Dupont', 'F. El Amrani', 'L. Garcia', 'ANSM Team'];

  const navigate = useNavigate();

  const handleCreateAudit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  try {

    const tempId = `tmp-${Date.now()}`;

    const tempAudit: AuditItem = {
      id: tempId,
      reference: 'Génération...',
      title: `${formData.type} - ${formData.site}`,
      site: formData.site,
      auditor: formData.auditor,
      type: formData.type,
      status: 'draft',
      score: 0,
      date: formData.date,
    };

    setAuditItems(prev => [tempAudit, ...prev]);

    setIsCreating(false);

    const response = await fetch(
      'http://localhost:8000/api/audits/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type_audit: formData.type,
          site_audit: formData.site
        })
      }
    );

    const data = await response.json();
    setAuditItems(prev =>
      prev.map(audit =>
        audit.id === tempId
          ? {
              ...audit,
              id: data.checklist_id,
              reference: data.checklist_id,
              status: 'in_progress'
            }
          : audit
      )
    );

  } catch (error) {

    setAuditItems(prev =>
      prev.map(audit =>
        audit.status === 'draft'
          ? {
              ...audit,
              status: 'error'
            }
          : audit
      )
    );
  }
};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audits"
        description="Planification, exécution et suivi des audits qualité"
        actions={
          <>
            <div className="flex rounded-xl border border-surface-border p-1 dark:border-dark-border">
              <button
                onClick={() => setView('list')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-ink-secondary dark:text-dark-subtext'}`}
              >
                Liste
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'calendar' ? 'bg-primary text-white' : 'text-ink-secondary dark:text-dark-subtext'}`}
              >
                Calendrier
              </button>
            </div>
            <Button variant="primary" onClick={() => setIsCreating(true)}><Icon name="Plus" size={16} /> Nouvel audit</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {['Tous', 'Internal', 'Supplier', 'Regulatory', 'Self-Inspection'].map((f, i) => (
          <button key={f} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${i === 0 ? 'border-primary bg-primary-50 text-primary dark:bg-primary/15' : 'border-surface-border text-ink-secondary hover:bg-slate-50 dark:border-dark-border dark:text-dark-subtext dark:hover:bg-white/5'}`}>
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm"><Icon name="Filter" size={14} /> Filtres</Button>
          <Button variant="outline" size="sm"><Icon name="Download" size={14} /> Export</Button>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-surface-border bg-surface-card p-6 shadow-elevated dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-ink-primary dark:text-dark-text">Créer un nouvel audit</h3>
                <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">Renseignez les informations obligatoires pour planifier l’audit.</p>
              </div>
              <button type="button" onClick={() => setIsCreating(false)} className="rounded-lg p-2 text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5">
                <Icon name="X" size={18} />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCreateAudit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">
                  <span>Type d’audit <span className="text-danger">*</span></span>
                  <select
                    required
                    value={formData.type}
                    onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value as AuditType }))}
                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                  >
                    {auditTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">
                  <span>Site <span className="text-danger">*</span></span>
                  <select
                    required
                    value={formData.site}
                    onChange={(event) => setFormData((prev) => ({ ...prev, site: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                  >
                    {siteOptions.map((site) => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">
                  <span>Auditeur <span className="text-danger">*</span></span>
                  <select
                    required
                    value={formData.auditor}
                    onChange={(event) => setFormData((prev) => ({ ...prev, auditor: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                  >
                    {auditorOptions.map((auditor) => (
                      <option key={auditor} value={auditor}>{auditor}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">
                  <span>Date de l’audit <span className="text-danger">*</span></span>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Annuler</Button>
                <Button type="submit" variant="primary">Créer checklist</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'list' ? (
        <DataTable columns={columns} data={auditItems} onRowClick={() => {}} />
      ) : (
        <div className="grid grid-cols-7 gap-2 rounded-2xl border border-surface-border bg-surface-card p-4 dark:border-dark-border dark:bg-dark-card">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d} className="pb-2 text-center text-xs font-semibold text-ink-secondary dark:text-dark-subtext">{d}</div>
          ))}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const dayAudits = auditItems.filter((a) => new Date(a.date).getDate() === day);
            return (
              <div key={i} className="min-h-[84px] rounded-xl border border-surface-border p-2 text-xs dark:border-dark-border">
                <span className="font-semibold text-ink-secondary dark:text-dark-subtext">{day}</span>
                {dayAudits.map((a) => (
                  <div key={a.id} className="mt-1 truncate rounded-md bg-primary-50 px-1.5 py-1 text-[10px] font-medium text-primary dark:bg-primary/15 dark:text-primary-100">
                    {a.reference}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
