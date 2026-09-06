
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { PageHeader } from '../components/shared/PageHeader';
import { Icon } from '../components/ui/Icon';
import { Badge } from '../components/ui/Badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/Card';
import { cn } from '../utils/cn';

// ==========================================================
// TYPES
// ==========================================================

type CapaStatus = 'Ouverte' | 'Terminé' | 'Expiré';
type CapaPriority = 'Mineure' | 'Majeure' | 'Critique';

interface CapaAction {
  probleme: string;
  cause_racine: string;
  action_corrective: string;
  action_preventive: string;
  priorite: CapaPriority;
  responsable: string;
  echeance: string;
  statut_action: CapaStatus;
}

interface CapaPlan {
  created_at: string;
  capa_id: string;
  audit_id?: string;
  description_probleme?: string;
  resume: string;
  actions: CapaAction[];
}

interface Audit {
  audit_id: string;
  type_audit?: string;
  site_audit?: string;
  status?: string;
  date_audit?: string;
  responsable?: string;
  analysis?: {
    score_conformite?: number;
  };
}

interface Report {
  report_id: string;
  audit_id: string;
  titre?: string;
  created_at?: string;
}

interface Conversation {
  conversation_id: string;
  title?: string;
  created_at?: string;
}

// ==========================================================
// API
// ==========================================================

const API_URL = 'http://localhost:8000/api';

// ==========================================================
// KPI CARD
// ==========================================================

function KpiCard({
  title,
  value,
  description,
  icon,
  tone = 'primary',
}: {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full p-5 transition-all duration-200 hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-ink-secondary dark:text-dark-subtext">
              {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-ink-primary dark:text-dark-text">
              {value}
            </p>

            <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">
              {description}
            </p>
          </div>

          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl',
              toneClass
            )}
          >
            <Icon name={icon} size={21} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ==========================================================
// COMPLIANCE RING
// ==========================================================

function ComplianceRing({ score }: { score: number }) {
  const clamped = Math.min(Math.max(score, 0), 100);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (clamped / 100) * circumference;

  const ringColor =
    clamped >= 90
      ? 'text-success'
      : clamped >= 75
        ? 'text-warning'
        : 'text-danger';

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg
        width="176"
        height="176"
        className="-rotate-90"
      >
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          strokeWidth="18"
          stroke="currentColor"
          className="text-slate-100 dark:text-white/10"
        />

        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          strokeWidth="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            'transition-all duration-700 ease-out',
            ringColor
          )}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-ink-primary dark:text-dark-text">
          {Math.round(clamped)}%
        </p>

        <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">
          conformité
        </p>
      </div>
    </div>
  );
}

// ==========================================================
// PROGRESS ROW
// ==========================================================

function ProgressRow({
  label,
  value,
  total,
  colorClass,
  dotClass,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
  dotClass: string;
}) {
  const pct =
    total > 0
      ? (value / total) * 100
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              dotClass
            )}
          />

          <span className="text-xs font-medium text-ink-primary dark:text-dark-text">
            {label}
          </span>
        </div>

        <span className="text-xs font-semibold text-ink-secondary dark:text-dark-subtext">
          {value}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            colorClass
          )}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}

// ==========================================================
// AUDIT STATUS ROW
// ==========================================================

function AuditStatusRow({
  label,
  value,
  total,
  colorClass,
  dotClass,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
  dotClass: string;
}) {
  const pct =
    total > 0
      ? (value / total) * 100
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              dotClass
            )}
          />

          <span className="text-xs font-medium text-ink-primary dark:text-dark-text">
            {label}
          </span>
        </div>

        <span className="text-xs font-semibold text-ink-secondary dark:text-dark-subtext">
          {value}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            colorClass
          )}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function Dashboard() {
  const [capas, setCapas] = useState<CapaPlan[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // ========================================================
  // FETCH DATA
  // ========================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        capaResponse,
        auditResponse,
        reportResponse,
        chatResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/capa/`),
        fetch(`${API_URL}/audits/`),
        fetch(`${API_URL}/reports/`),
        fetch(`${API_URL}/conversations`),
      ]);

      if (capaResponse.ok) {
        setCapas(await capaResponse.json());
      }

      if (auditResponse.ok) {
        setAudits(await auditResponse.json());
      }

      if (reportResponse.ok) {
        setReports(await reportResponse.json());
      }

      if (chatResponse.ok) {
        setConversations(await chatResponse.json());
      }
    } catch (error) {
      console.error(
        'Erreur chargement Dashboard :',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ========================================================
  // CAPA DATA
  // ========================================================

  /*
   * IMPORTANT :
   * Une CAPA peut contenir plusieurs actions.
   * Les statistiques CAPA sont donc calculées
   * sur capaActions et non sur capa_id.
   */

  const capaActions = useMemo(() => {
    return capas.flatMap((capa) => {
      if (!Array.isArray(capa.actions)) {
        return [];
      }

      return capa.actions.map((action) => ({
        ...action,
        capa_id: capa.capa_id,
        audit_id: capa.audit_id,
        created_at: capa.created_at,
      }));
    });
  }, [capas]);

  const capaStats = useMemo(() => {
    const total = capaActions.length;

    const ouvertes = capaActions.filter(
      (action) =>
        action.statut_action === 'Ouverte'
    ).length;

    const terminees = capaActions.filter(
      (action) =>
        action.statut_action === 'Terminé'
    ).length;

    const expirees = capaActions.filter(
      (action) =>
        action.statut_action === 'Expiré'
    ).length;

    const critiques = capaActions.filter(
      (action) =>
        action.priorite === 'Critique'
    ).length;

    const majeures = capaActions.filter(
      (action) =>
        action.priorite === 'Majeure'
    ).length;

    const mineures = capaActions.filter(
      (action) =>
        action.priorite === 'Mineure'
    ).length;

    const tauxTermine =
      total > 0
        ? Math.round(
            (terminees / total) * 100
          )
        : 0;

    return {
      total,
      ouvertes,
      terminees,
      expirees,
      critiques,
      majeures,
      mineures,
      tauxTermine,
    };
  }, [capaActions]);

  // ========================================================
  // AUDIT DATA
  // ========================================================

  const auditStats = useMemo(() => {
    const total = audits.length;

    const termines = audits.filter(
      (audit) =>
        audit.status === 'terminé'
    ).length;

    const enCours = audits.filter(
      (audit) =>
        audit.status === 'en cours'
    ).length;

    const scores = audits
      .map(
        (audit) =>
          audit.analysis?.score_conformite
      )
      .filter(
        (score): score is number =>
          typeof score === 'number'
      );

    const scoreMoyen =
      scores.length > 0
        ? scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) / scores.length
        : 0;

    const tauxTermine =
      total > 0
        ? Math.round(
            (termines / total) * 100
          )
        : 0;

    return {
      total,
      termines,
      enCours,
      scoreMoyen,
      tauxTermine,
    };
  }, [audits]);

  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Vue globale de la qualité et du suivi des actions."
        />

        <Card className="p-10 text-center">
          <p className="text-sm text-ink-secondary dark:text-dark-subtext">
            Chargement du Dashboard...
          </p>
        </Card>
      </div>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <PageHeader
        title="Dashboard"
        description="Vue globale de la qualité, des audits, des CAPA et des rapports."
      />

      {/* ==================================================
          KPI GLOBAUX
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <KpiCard
          title="Total audits"
          value={audits.length}
          description="Audits enregistrés"
          icon="ClipboardCheck"
          tone="primary"
        />

        <KpiCard
          title="Total CAPA"
          value={capaStats.total}
          description="Actions CAPA enregistrées"
          icon="Wrench"
          tone="primary"
        />

        <KpiCard
          title="Total rapports"
          value={reports.length}
          description="Rapports générés"
          icon="FileText"
          tone="success"
        />

        <KpiCard
          title="Conversations IA"
          value={conversations.length}
          description="Conversations enregistrées"
          icon="Sparkles"
          tone="primary"
        />

      </div>

      {/* ==================================================
          AUDIT : CONFORMITE + SUIVI
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* CONFORMITE DES AUDITS */}

        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">

            <CardHeader className="px-0 pt-0">

              <div>
                <CardTitle>
                  Conformité des audits
                </CardTitle>

                <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">
                  Score moyen de conformité
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <Icon
                  name="ChartNoAxesCombined"
                  size={20}
                />
              </div>

            </CardHeader>

            <CardContent className="px-0 pb-0">

              <div className="mt-4 flex items-center justify-center">
                <ComplianceRing
                  score={auditStats.scoreMoyen}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">

                  <p className="text-xs text-ink-secondary dark:text-dark-subtext">
                    Terminés
                  </p>

                  <p className="mt-1 text-lg font-semibold text-success">
                    {auditStats.termines}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">

                  <p className="text-xs text-ink-secondary dark:text-dark-subtext">
                    En cours
                  </p>

                  <p className="mt-1 text-lg font-semibold text-info">
                    {auditStats.enCours}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>
        </motion.div>

        {/* SUIVI DES AUDITS */}

        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">

            <CardHeader className="px-0 pt-0">

              <div>
                <CardTitle>
                  Suivi des audits
                </CardTitle>

                <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">
                  État d'avancement des audits
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon
                  name="ClipboardCheck"
                  size={20}
                />
              </div>

            </CardHeader>

            <CardContent className="space-y-6 px-0 pb-0">

              <AuditStatusRow
                label="Terminés"
                value={auditStats.termines}
                total={auditStats.total}
                colorClass="bg-success"
                dotClass="bg-success"
              />

              <AuditStatusRow
                label="En cours"
                value={auditStats.enCours}
                total={auditStats.total}
                colorClass="bg-info"
                dotClass="bg-info"
              />

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-white/5">

                <span className="text-xs text-ink-secondary dark:text-dark-subtext">
                  Taux de réalisation
                </span>

                <span className="text-lg font-bold text-success">
                  {auditStats.tauxTermine}%
                </span>

              </div>

            </CardContent>

          </Card>
        </motion.div>

      </div>

      {/* ==================================================
          CAPA : SUIVI + PRIORITE
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* SUIVI DES CAPA */}

        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">

            <CardHeader className="px-0 pt-0">

              <div>
                <CardTitle>
                  Suivi des CAPA
                </CardTitle>

                <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">
                  Répartition des actions par statut
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon
                  name="ChartPie"
                  size={20}
                />
              </div>

            </CardHeader>

            <CardContent className="space-y-5 px-0 pb-0">

              <ProgressRow
                label="Ouvertes"
                value={capaStats.ouvertes}
                total={capaStats.total}
                colorClass="bg-info"
                dotClass="bg-info"
              />

              <ProgressRow
                label="Terminées"
                value={capaStats.terminees}
                total={capaStats.total}
                colorClass="bg-success"
                dotClass="bg-success"
              />

              <ProgressRow
                label="Expirées"
                value={capaStats.expirees}
                total={capaStats.total}
                colorClass="bg-danger"
                dotClass="bg-danger"
              />

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-white/5">

                <span className="text-xs text-ink-secondary dark:text-dark-subtext">
                  Taux de clôture
                </span>

                <span className="text-lg font-bold text-success">
                  {capaStats.tauxTermine}%
                </span>

              </div>

            </CardContent>

          </Card>
        </motion.div>

        {/* PRIORITE DES ACTIONS */}

        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">

            <CardHeader className="px-0 pt-0">

              <div>
                <CardTitle>
                  Priorité des actions
                </CardTitle>

                <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">
                  Niveau de criticité des CAPA
                </p>
              </div>

              <Icon
                name="AlertTriangle"
                size={20}
                className="text-ink-secondary dark:text-dark-subtext"
              />

            </CardHeader>

            <CardContent className="space-y-4 px-0 pb-0">

              {[
                {
                  label: 'Critique',
                  value: capaStats.critiques,
                  tone: 'danger' as const,
                  dot: 'bg-danger',
                  bar: 'bg-danger',
                },
                {
                  label: 'Majeure',
                  value: capaStats.majeures,
                  tone: 'warning' as const,
                  dot: 'bg-warning',
                  bar: 'bg-warning',
                },
                {
                  label: 'Mineure',
                  value: capaStats.mineures,
                  tone: 'neutral' as const,
                  dot: 'bg-slate-400',
                  bar: 'bg-slate-400',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4"
                >

                  <div className="w-20 shrink-0">
                    <Badge tone={item.tone}>
                      {item.label}
                    </Badge>
                  </div>

                  <div className="flex-1">

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">

                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          item.bar
                        )}
                        style={{
                          width: `${
                            capaStats.total > 0
                              ? (item.value / capaStats.total) * 100
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-ink-primary dark:text-dark-text">
                    {item.value}
                  </span>

                </div>
              ))}

            </CardContent>

          </Card>
        </motion.div>

      </div>

    </div>
  );
}
