import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';

interface Report {
  report_id: string;
  audit_id: string;
  titre?: string;
}

export default function ReportsPage() {

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchReports = async () => {

      try {

        setLoading(true);
        setError(null);

        const response = await fetch(
          'http://localhost:8000/api/reports/'
        );

        if (!response.ok) {
          throw new Error(
            'Impossible de récupérer les rapports'
          );
        }

        const data: Report[] =
          await response.json();

        setReports(data);

      } catch (error) {

        console.error(
          'Erreur récupération rapports :',
          error
        );

        setError(
          'Impossible de charger les rapports.'
        );

      } finally {

        setLoading(false);

      }
    };

    fetchReports();

  }, []);

  return (
    <div className="space-y-6">

      <PageHeader
        title="Rapports"
        description=""
      />

      <Card>

        {/* HEADER */}

        <div className="flex items-center justify-between px-5 pt-5">

          <h3 className="text-sm font-semibold text-ink-primary dark:text-dark-text">
            Rapports générés
          </h3>

          <span className="text-xs text-ink-secondary dark:text-dark-subtext">
            {reports.length} rapport
            {reports.length > 1 ? 's' : ''}
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="px-5 py-8 text-center">

            <p className="text-sm text-ink-secondary dark:text-dark-subtext">
              Chargement des rapports...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="px-5 py-8 text-center">

            <p className="text-sm text-red-500">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          reports.length === 0 && (

            <div className="px-5 py-8 text-center">

              <p className="text-sm text-ink-secondary dark:text-dark-subtext">
                Aucun rapport généré.
              </p>

            </div>
          )}

        {/* RAPPORTS */}

        {!loading &&
          !error &&
          reports.length > 0 && (

            <div className="divide-y divide-surface-border dark:divide-dark-border">

              {reports.map((report) => (

  <div
    key={report.report_id}
    className="flex items-center justify-between gap-3 px-5 py-4"
  >

    {/* INFORMATIONS DU RAPPORT */}

<div className="flex items-center gap-3">

  {/* REPORT ID */}
  <span className="text-xs font-semibold text-primary">
    {report.report_id}
  </span>

  {/* ICÔNE */}
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-ink-secondary dark:bg-white/5 dark:text-dark-subtext">
    <Icon
      name="FileText"
      size={17}
    />
  </div>

  {/* TITRE + AUDIT */}
  <div>

    <p className="text-sm font-medium text-ink-primary dark:text-dark-text">
      {report.titre || 'Rapport'}
    </p>

    <p className="text-xs text-ink-secondary dark:text-dark-subtext">
      Audit : {report.audit_id} · PDF
    </p>

  </div>

</div>

    {/* DOWNLOAD */}

    <Button
  variant="ghost"
  size="icon"
  title="Télécharger le rapport"
  onClick={() => {
    window.open(
      `http://localhost:8000/api/reports/pdf/report/${report.report_id}`,
      '_blank'
    );
  }}
>
  <Icon
    name="Download"
    size={16}
  />
</Button>

  </div>

))}

            </div>
          )}

      </Card>

    </div>
  );
}