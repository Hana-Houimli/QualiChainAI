
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

// ==========================================================
// TYPES
// ==========================================================

type CapaStatus =
  | 'Ouverte'
  | 'Terminé'
  | 'Expiré';

type CapaPriority =
  | 'Mineure'
  | 'Majeure'
  | 'Critique';

type CapaSourceFilter =
  | 'Toutes'
  | 'Audits'
  | 'Réclamations';

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

interface CapaCard {
  id: string;
  capaId: string;
  actionIndex: number;
  reference: string;
  title: string;
  source: string;
  owner: string;
  priority: CapaPriority;
  status: CapaStatus;
  dueDate: string;
  progress: number;
  action: CapaAction;
  capa: CapaPlan;
}

// ==========================================================
// COLONNES
// ==========================================================

const columns: {
  key: CapaStatus;
  label: string;
  tone: string;
}[] = [
  {
    key: 'Ouverte',
    label: 'Ouverte',
    tone: 'bg-info',
  },
  {
    key: 'Terminé',
    label: 'Terminé',
    tone: 'bg-success',
  },
  {
    key: 'Expiré',
    label: 'Expiré',
    tone: 'bg-danger',
  },
];

// ==========================================================
// PRIORITE
// ==========================================================

const priorityTone: Record<
  CapaPriority,
  'neutral' | 'warning' | 'danger' | 'info'
> = {
  Mineure: 'neutral',
  Majeure: 'warning',
  Critique: 'danger',
};

// ==========================================================
// COMPOSANT
// ==========================================================

export default function CapaBoard() {

  // ========================================================
  // VIEW
  // ========================================================

  const [view, setView] =
    useState<'kanban' | 'list' | 'timeline'>('kanban');

  const [sourceFilter, setSourceFilter] =
    useState<CapaSourceFilter>('Toutes');

  // ========================================================
  // CAPAS
  // ========================================================

  const [capaItems, setCapaItems] =
    useState<CapaPlan[]>([]);

  // ========================================================
  // LOADING
  // ========================================================

  const [loading, setLoading] =
    useState(true);

  // ========================================================
  // CREATION CAPA
  // ========================================================

  const [isCreating, setIsCreating] =
    useState(false);

  const [problem, setProblem] =
    useState('');

  const [generating, setGenerating] =
    useState(false);

  // ========================================================
  // MODAL DETAIL ACTION
  // ========================================================

  const [selectedAction, setSelectedAction] =
    useState<{
      capa: CapaPlan;
      action: CapaAction;
      actionIndex: number;
    } | null>(null);

  // ========================================================
  // NOUVEAU STATUT
  // ========================================================

  const [newStatus, setNewStatus] =
    useState<CapaStatus>('Ouverte');

  // ========================================================
  // SAUVEGARDE STATUT
  // ========================================================

  const [savingStatus, setSavingStatus] =
    useState(false);

  // ========================================================
  // SUPPRESSION
  // ========================================================

  const [deletingAction, setDeletingAction] =
    useState<{
      capa: CapaPlan;
      action: CapaAction;
      actionIndex: number;
    } | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  // ========================================================
  // RECUPERER LES CAPA
  // ========================================================

  const fetchCapas = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:8000/api/capa/'
      );

      if (!response.ok) {
        throw new Error(
          `Erreur serveur : ${response.status}`
        );
      }

      const data: CapaPlan[] =
        await response.json();

      setCapaItems(data);

      return data;

    } catch (error) {

      console.error(
        'Erreur récupération CAPA :',
        error
      );

      return [];

    } finally {

      setLoading(false);

    }
  };

  // ========================================================
  // CHARGEMENT INITIAL
  // ========================================================

  useEffect(() => {

    const loadCapas = async () => {

      const data = await fetchCapas();

      if (data.length > 0) {
        await checkExpiredCapas(data);
      }

    };

    loadCapas();

  }, []);

  // ========================================================
  // GENERER UNE CAPA
  // ========================================================

  const handleGenerateCapa = async () => {

    if (!problem.trim()) {

      alert(
        'Veuillez décrire le problème rencontré.'
      );

      return;
    }

    try {

      setGenerating(true);

      const response = await fetch(
        'http://localhost:8000/api/capa/generate',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: problem,
          }),
        }
      );

      if (!response.ok) {

        const errorData =
          await response.json().catch(
            () => null
          );

        throw new Error(
          errorData?.detail ||
          `Erreur serveur : ${response.status}`
        );
      }

      await response.json();

      setProblem('');
      setIsCreating(false);

      await fetchCapas();

    } catch (error) {

      console.error(
        'Erreur génération CAPA :',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Impossible de générer la CAPA.'
      );

    } finally {

      setGenerating(false);

    }
  };

  // ========================================================
  // CALCUL DATE ECHEANCE
  // ========================================================

  const calculateDueDate = (
    createdAt: string,
    echeance: string
  ): string => {

    if (!createdAt || !echeance) {
      return '';
    }

    const text =
      String(echeance)
        .toLowerCase()
        .trim();

    const match = text.match(
      /(\d+)\s*(ans?|années?|annees?|mois|jours?|semaines?|years?|months?|weeks?|days?)/i
    );

    if (!match) {
      return '';
    }

    const value =
      Number(match[1]);

    const unit =
      match[2].toLowerCase();

    if (!Number.isFinite(value)) {
      return '';
    }

    const dateMatch =
      String(createdAt).match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

    if (!dateMatch) {

      console.error(
        'Date created_at invalide :',
        createdAt
      );

      return '';
    }

    const year =
      Number(dateMatch[1]);

    const month =
      Number(dateMatch[2]);

    const day =
      Number(dateMatch[3]);

    const dueDate =
      new Date(
        year,
        month - 1,
        day
      );

    // ======================================================
    // ANNEES
    // ======================================================

    if (
      /^(ans?|années?|annees?|years?)$/.test(unit)
    ) {

      dueDate.setFullYear(
        dueDate.getFullYear() + value
      );

    }

    // ======================================================
    // MOIS
    // ======================================================

    else if (
      /^(mois|months?)$/.test(unit)
    ) {

      dueDate.setMonth(
        dueDate.getMonth() + value
      );

    }

    // ======================================================
    // SEMAINES
    // ======================================================

    else if (
      /^(semaines?|weeks?)$/.test(unit)
    ) {

      dueDate.setDate(
        dueDate.getDate() + value * 7
      );

    }

    // ======================================================
    // JOURS
    // ======================================================

    else {

      dueDate.setDate(
        dueDate.getDate() + value
      );

    }

    const resultYear =
      dueDate.getFullYear();

    const resultMonth =
      String(
        dueDate.getMonth() + 1
      ).padStart(2, '0');

    const resultDay =
      String(
        dueDate.getDate()
      ).padStart(2, '0');

    return `${resultYear}-${resultMonth}-${resultDay}`;
  };

  // ========================================================
  // VERIFIER LES CAPA EXPIREES
  // ========================================================

  const checkExpiredCapas = async (
    capas: CapaPlan[]
  ) => {

    let hasChanged = false;

    for (const capa of capas) {

      if (!Array.isArray(capa.actions)) {
        continue;
      }

      for (
        let index = 0;
        index < capa.actions.length;
        index++
      ) {

        const action =
          capa.actions[index];

        // Seulement les actions ouvertes
        if (
          action.statut_action !== 'Ouverte'
        ) {
          continue;
        }

        const dueDate =
          calculateDueDate(
            capa.created_at,
            action.echeance
          );

        if (!dueDate) {
          continue;
        }

        const today =
          new Date();

        const due =
          new Date(dueDate);

        today.setHours(
          0,
          0,
          0,
          0
        );

        due.setHours(
          0,
          0,
          0,
          0
        );

        if (due < today) {

          try {

            const response =
              await fetch(
                `http://localhost:8000/api/capa/${capa.capa_id}/actions/${index}/status`,
                {
                  method: 'PATCH',

                  headers: {
                    'Content-Type':
                      'application/json',
                  },

                  body: JSON.stringify({
                    statut_action:
                      'Expiré',
                  }),
                }
              );

            if (response.ok) {
              hasChanged = true;
            }

          } catch (error) {

            console.error(
              'Erreur expiration CAPA :',
              error
            );

          }
        }
      }
    }

    // Recharger après modification
    if (hasChanged) {

      const response =
        await fetch(
          'http://localhost:8000/api/capa/'
        );

      if (response.ok) {

        const updatedData:
          CapaPlan[] =
          await response.json();

        setCapaItems(
          updatedData
        );
      }
    }
  };

  // ========================================================
  // OUVRIR LE FORMULAIRE D'UNE ACTION
  // ========================================================

  const handleOpenAction = (
    capa: CapaPlan,
    action: CapaAction,
    actionIndex: number
  ) => {

    setSelectedAction({
      capa,
      action,
      actionIndex,
    });

    setNewStatus(
      action.statut_action
    );
  };

  // ========================================================
  // FERMER LE FORMULAIRE
  // ========================================================

  const handleCloseAction = () => {

    if (savingStatus) {
      return;
    }

    setSelectedAction(null);
  };

  // ========================================================
  // MODIFIER LE STATUT
  // ========================================================

  const handleSaveStatus = async () => {

    if (!selectedAction) {
      return;
    }

    // Une action expirée ne peut pas être modifiée
    if (
      selectedAction.action.statut_action ===
      'Expiré'
    ) {
      return;
    }

    try {

      setSavingStatus(true);

      const response =
        await fetch(
          `http://localhost:8000/api/capa/${selectedAction.capa.capa_id}/actions/${selectedAction.actionIndex}/status`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              statut_action:
                newStatus,
            }),
          }
        );

      if (!response.ok) {

        const errorData =
          await response
            .json()
            .catch(
              () => null
            );

        throw new Error(
          errorData?.detail ||
          `Erreur serveur : ${response.status}`
        );
      }

      setSelectedAction(null);

      await fetchCapas();

    } catch (error) {

      console.error(
        'Erreur modification statut :',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Impossible de modifier le statut.'
      );

    } finally {

      setSavingStatus(false);

    }
  };

  // ========================================================
  // OUVRIR CONFIRMATION SUPPRESSION
  // ========================================================

  const handleAskDeleteAction = (
    event: React.MouseEvent,
    capa: CapaPlan,
    action: CapaAction,
    actionIndex: number
  ) => {

    // Très important :
    // empêche le clic sur la corbeille
    // d'ouvrir également le formulaire.
    event.stopPropagation();

    setDeletingAction({
      capa,
      action,
      actionIndex,
    });
  };

  // ========================================================
  // ANNULER SUPPRESSION
  // ========================================================

  const handleCancelDelete = () => {

    if (deleting) {
      return;
    }

    setDeletingAction(null);
  };

  // ========================================================
  // SUPPRIMER UNE ACTION
  // ========================================================

  const handleDeleteAction = async () => {

    if (!deletingAction) {
      return;
    }

    try {

      setDeleting(true);

      const response =
        await fetch(
          `http://localhost:8000/api/capa/${deletingAction.capa.capa_id}/actions/${deletingAction.actionIndex}`,
          {
            method: 'DELETE',
          }
        );

      if (!response.ok) {

        const errorData =
          await response
            .json()
            .catch(
              () => null
            );

        throw new Error(
          errorData?.detail ||
          `Erreur serveur : ${response.status}`
        );
      }

      // Fermer la confirmation
      setDeletingAction(null);

      // Si jamais le formulaire était ouvert
      setSelectedAction(null);

      // Recharger MongoDB
      await fetchCapas();

    } catch (error) {

      console.error(
        'Erreur suppression action CAPA :',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Impossible de supprimer cette action.'
      );

    } finally {

      setDeleting(false);

    }
  };

  // ========================================================
  // TRANSFORMER ACTIONS EN CARDS
  // ========================================================

  const capaCards: CapaCard[] =
    capaItems
      .flatMap((capa) => {

        if (
          !Array.isArray(
            capa.actions
          )
        ) {
          return [];
        }

        return capa.actions.map(
          (
            action,
            index
          ) => {

            const card: CapaCard = {

              id:
                `${capa.capa_id}-${index}`,

              capaId:
                capa.capa_id,

              actionIndex:
                index,

              reference:
                capa.capa_id,

              title:
                action.probleme ||
                capa.resume ||
                'Action CAPA',

              source:
                capa.audit_id
                  ? capa.audit_id
                  : 'Réclamation',

              owner:
                action.responsable ||
                'Non défini',

              priority:
                action.priorite ||
                'Mineure',

              status:
                action.statut_action ||
                'Ouverte',

              dueDate:
                calculateDueDate(
                  capa.created_at,
                  action.echeance
                ),

              progress:
                action.statut_action ===
                'Terminé'
                  ? 100
                  : action.statut_action ===
                    'Expiré'
                    ? 100
                    : 50,

              action,

              capa,
            };

            return card;
          }
        );
      })
      .filter((card) => {

        if (
          sourceFilter === 'Toutes'
        ) {
          return true;
        }

        if (
          sourceFilter === 'Audits'
        ) {
          return card.capa.audit_id !== undefined;
        }

        if (
          sourceFilter ===
          'Réclamations'
        ) {
          return card.capa.audit_id === undefined;
        }

        return true;
      });

  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <PageHeader

        title="CAPA"

        description="Actions correctives et préventives — workflow et suivi des responsables"

        actions={

          <>

            {/* FILTRE SOURCE */}

            <div className="flex rounded-xl border border-surface-border p-1 dark:border-dark-border">

              {(
                [
                  'Toutes',
                  'Audits',
                  'Réclamations',
                ] as const
              ).map(
                (filter) => (

                  <button

                    key={filter}

                    type="button"

                    onClick={() =>
                      setSourceFilter(
                        filter
                      )
                    }

                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',

                      sourceFilter ===
                        filter
                        ? 'bg-primary text-white'
                        : 'text-ink-secondary dark:text-dark-subtext'
                    )}

                  >

                    {filter}

                  </button>

                )
              )}

            </div>

            {/* VUE */}

            <div className="flex rounded-xl border border-surface-border p-1 dark:border-dark-border">

              {(
                [
                  'kanban',
                  'list',
                  'timeline',
                ] as const
              ).map(
                (v) => (

                  <button

                    key={v}

                    type="button"

                    onClick={() =>
                      setView(v)
                    }

                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors',

                      view === v
                        ? 'bg-primary text-white'
                        : 'text-ink-secondary dark:text-dark-subtext'
                    )}

                  >

                    {v}

                  </button>

                )
              )}

            </div>

            {/* NOUVELLE CAPA */}

            <Button

              variant="primary"

              onClick={() =>
                setIsCreating(true)
              }

            >

              <Icon
                name="Plus"
                size={16}
              />

              Nouvelle CAPA

            </Button>

          </>

        }

      />

      {/* ==================================================
          MODAL NOUVELLE CAPA
      ================================================== */}

      {isCreating && (

        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">

          <div className="w-full max-w-2xl rounded-3xl border border-surface-border bg-surface-card p-6 shadow-elevated dark:border-dark-border dark:bg-dark-card">

            <div className="flex items-start justify-between gap-4">

              <div>

                <h3 className="text-lg font-semibold text-ink-primary dark:text-dark-text">

                  Nouvelle CAPA

                </h3>

                <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">

                  Décrivez le problème rencontré afin que l’IA génère les actions correctives et préventives.

                </p>

              </div>

              <button

                type="button"

                onClick={() => {

                  setIsCreating(false);
                  setProblem('');

                }}

                className="rounded-lg p-2 text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5"

              >

                <Icon
                  name="X"
                  size={18}
                />

              </button>

            </div>

            <div className="mt-6">

              <label className="text-sm font-medium text-ink-primary dark:text-dark-text">

                Problème rencontré

              </label>

              <textarea

                value={problem}

                onChange={(event) =>
                  setProblem(
                    event.target.value
                  )
                }

                placeholder="Ex. Une température hors plage a été détectée dans la chambre froide..."

                rows={6}

                className="mt-2 w-full resize-none rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"

              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <Button

                type="button"

                variant="outline"

                onClick={() => {

                  setIsCreating(false);
                  setProblem('');

                }}

                disabled={generating}

              >

                Annuler

              </Button>

              <Button

                type="button"

                variant="primary"

                onClick={
                  handleGenerateCapa
                }

                disabled={
                  generating ||
                  !problem.trim()
                }

              >

                <Icon
                  name="Sparkles"
                  size={16}
                />

                {generating
                  ? 'Génération...'
                  : 'Générer la CAPA'}

              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          MODAL DETAIL ACTION
      ================================================== */}

      {selectedAction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-surface-border bg-surface-card p-6 shadow-elevated dark:border-dark-border dark:bg-dark-card">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="font-mono text-xs font-semibold text-primary">

                    {selectedAction.capa.capa_id}

                  </span>

                  {selectedAction.capa.audit_id && (

                    <Badge tone="info">

                      Audit :
                      {' '}
                      {selectedAction.capa.audit_id}

                    </Badge>

                  )}

                  {!selectedAction.capa.audit_id && (

                    <Badge tone="neutral">

                      Réclamation

                    </Badge>

                  )}

                </div>

                <h3 className="mt-2 text-lg font-semibold text-ink-primary dark:text-dark-text">

                  Détail de l'action CAPA

                </h3>

              </div>

              <button

                type="button"

                onClick={
                  handleCloseAction
                }

                disabled={
                  savingStatus
                }

                className="rounded-lg p-2 text-ink-secondary hover:bg-slate-100 disabled:opacity-50 dark:text-dark-subtext dark:hover:bg-white/5"

              >

                <Icon
                  name="X"
                  size={18}
                />

              </button>

            </div>

            {/* INFORMATIONS */}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* PROBLEME */}

              <div className="md:col-span-2">

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Problème

                </label>

                <div className="mt-1 rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {selectedAction.action.probleme ||
                    '—'}

                </div>

              </div>

              {/* CAUSE */}

              <div className="md:col-span-2">

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Cause racine

                </label>

                <div className="mt-1 rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {selectedAction.action.cause_racine ||
                    '—'}

                </div>

              </div>

              {/* ACTION CORRECTIVE */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Action corrective

                </label>

                <div className="mt-1 h-full rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {selectedAction.action.action_corrective ||
                    '—'}

                </div>

              </div>

              {/* ACTION PREVENTIVE */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Action préventive

                </label>

                <div className="mt-1 h-full rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {selectedAction.action.action_preventive ||
                    '—'}

                </div>

              </div>

              {/* PRIORITE */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Priorité

                </label>

                <div className="mt-2">

                  <Badge
                    tone={
                      priorityTone[
                        selectedAction.action.priorite
                      ]
                    }
                  >

                    {selectedAction.action.priorite}

                  </Badge>

                </div>

              </div>

              {/* RESPONSABLE */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Responsable

                </label>

                <div className="mt-1 rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {selectedAction.action.responsable ||
                    'Non défini'}

                </div>

              </div>

              {/* ECHEANCE */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Échéance

                </label>

                <div className="mt-1 rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {selectedAction.action.echeance ||
                    '—'}

                </div>

              </div>

              {/* DATE LIMITE */}

              <div>

                <label className="text-xs font-semibold uppercase tracking-wide text-ink-secondary dark:text-dark-subtext">

                  Date limite calculée

                </label>

                <div className="mt-1 rounded-xl border border-surface-border bg-surface-bg p-3 text-sm text-ink-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">

                  {calculateDueDate(
                    selectedAction.capa.created_at,
                    selectedAction.action.echeance
                  )
                    ? new Date(
                        calculateDueDate(
                          selectedAction.capa.created_at,
                          selectedAction.action.echeance
                        )
                      ).toLocaleDateString(
                        'fr-FR'
                      )
                    : '—'}

                </div>

              </div>

            </div>

            {/* STATUT */}

            <div className="mt-6 rounded-2xl border border-surface-border p-4 dark:border-dark-border">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-semibold text-ink-primary dark:text-dark-text">

                    Statut de l'action

                  </p>

                  <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">

                    {selectedAction.action.statut_action ===
                    'Expiré'

                      ? 'Cette action est expirée et ne peut plus être modifiée.'

                      : 'Vous pouvez changer le statut entre Ouverte et Terminé.'}

                  </p>

                </div>

                {/* ACTION EXPIREE */}

                {selectedAction.action.statut_action ===
                'Expiré' ? (

                  <Badge tone="danger">
                    Expiré
                  </Badge>

                ) : (

                  /* ACTION OUVERTE / TERMINEE */

                  <select

                    value={newStatus}

                    onChange={(event) =>
                      setNewStatus(
                        event.target.value as CapaStatus
                      )
                    }

                    disabled={
                      savingStatus
                    }

                    className="rounded-xl border border-surface-border bg-surface-bg px-4 py-2 text-sm font-medium text-ink-primary outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"

                  >

                    <option value="Ouverte">
                      Ouverte
                    </option>

                    <option value="Terminé">
                      Terminé
                    </option>

                  </select>

                )}

              </div>

            </div>

            {/* BOUTONS */}

            <div className="mt-6 flex justify-end gap-3">

              <Button

                type="button"

                variant="outline"

                onClick={
                  handleCloseAction
                }

                disabled={
                  savingStatus
                }

              >

                Fermer

              </Button>

              {selectedAction.action.statut_action !==
                'Expiré' && (

                <Button

                  type="button"

                  variant="primary"

                  onClick={
                    handleSaveStatus
                  }

                  disabled={
                    savingStatus ||
                    newStatus ===
                      selectedAction.action.statut_action
                  }

                >

                  {savingStatus
                    ? 'Enregistrement...'
                    : 'Enregistrer'}

                </Button>

              )}

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          MODAL CONFIRMATION SUPPRESSION
      ================================================== */}

      {deletingAction && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4">

          <div className="w-full max-w-md rounded-3xl border border-surface-border bg-surface-card p-6 shadow-elevated dark:border-dark-border dark:bg-dark-card">

            {/* HEADER */}

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">

                <Icon
                  name="Trash2"
                  size={20}
                />

              </div>

              <div>

                <h3 className="text-lg font-semibold text-ink-primary dark:text-dark-text">

                  Supprimer cette action ?

                </h3>

                <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">

                  Cette action sera supprimée de la CAPA
                  {' '}
                  <span className="font-semibold text-ink-primary dark:text-dark-text">

                    {deletingAction.capa.capa_id}

                  </span>
                  .

                </p>

              </div>

            </div>

            {/* PROBLEME */}

            <div className="mt-5 rounded-xl border border-surface-border bg-surface-bg p-3 dark:border-dark-border dark:bg-dark-bg">

              <p className="line-clamp-3 text-sm text-ink-primary dark:text-dark-text">

                {deletingAction.action.probleme ||
                  'Action CAPA'}

              </p>

            </div>

            <p className="mt-3 text-xs text-danger">

              Cette opération est définitive.

            </p>

            {/* BOUTONS */}

            <div className="mt-6 flex justify-end gap-3">

              <Button

                type="button"

                variant="outline"

                onClick={
                  handleCancelDelete
                }

                disabled={deleting}

              >

                Annuler

              </Button>

              <Button

                type="button"

                variant="primary"

                onClick={
                  handleDeleteAction
                }

                disabled={deleting}

              >

                <Icon
                  name="Trash2"
                  size={16}
                />

                {deleting
                  ? 'Suppression...'
                  : 'Supprimer'}

              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (

        <Card className="p-8 text-center">

          <p className="text-sm text-ink-secondary dark:text-dark-subtext">

            Chargement des CAPA...

          </p>

        </Card>

      )}

      {/* ==================================================
          KANBAN
      ================================================== */}

      {!loading &&
        view === 'kanban' && (

          <div className="space-y-6">

            {columns.map(
              (col) => {

                const items =
                  capaCards.filter(
                    (c) =>
                      c.status ===
                      col.key
                  );

                return (

                  <div
                    key={col.key}
                    className="rounded-2xl border border-surface-border bg-surface-card p-4 dark:border-dark-border dark:bg-dark-card"
                  >

                    {/* HEADER */}

                    <div className="mb-4 flex items-center gap-2">

                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          col.tone
                        )}
                      />

                      <h3 className="text-sm font-semibold text-ink-primary dark:text-dark-text">

                        {col.label}

                      </h3>

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-ink-secondary dark:bg-white/5 dark:text-dark-subtext">

                        {items.length}

                      </span>

                    </div>

                    {/* CARDS */}

                    {items.length > 0 ? (

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {items.map(
                          (
                            item,
                            i
                          ) => (

                            <motion.div

                              key={item.id}

                              initial={{
                                opacity: 0,
                                y: 8,
                              }}

                              animate={{
                                opacity: 1,
                                y: 0,
                              }}

                              transition={{
                                delay:
                                  i * 0.05,
                              }}

                            >

                              <Card
                                    onClick={() =>
                                      handleOpenAction(
                                        item.capa,
                                        item.action,
                                        item.actionIndex
                                      )
                                    }
                                    className="
                                      h-full
                                      cursor-pointer
                                      p-4
                                      transition-all
                                      duration-200
                                      ease-out
                                      hover:scale-[1.02]
                                      hover:shadow-elevated
                                    "
                                  >

                                {/* =================================================
                                    CORBEILLE
                                ================================================== */}

                                <button

                                  type="button"

                                  onClick={(event) =>
                                    handleAskDeleteAction(
                                      event,
                                      item.capa,
                                      item.action,
                                      item.actionIndex
                                    )
                                  }

                                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-danger/10 hover:text-danger dark:text-dark-subtext"

                                  title="Supprimer cette action"

                                >

                                  <Icon
                                    name="Trash2"
                                    size={16}
                                  />

                                </button>

                                {/* REFERENCE + PRIORITE */}

                                <div className="flex items-start justify-between gap-2 pr-9">

                                  <span className="font-mono text-[11px] font-semibold text-primary">

                                    {item.reference}

                                  </span>

                                  <Badge
                                    tone={
                                      priorityTone[
                                        item.priority
                                      ]
                                    }
                                  >

                                    {item.priority}

                                  </Badge>

                                </div>

                                {/* TITRE */}

                                <p className="mt-3 text-sm font-medium leading-snug text-ink-primary dark:text-dark-text">

                                  {item.title}

                                </p>

                                {/* SOURCE */}

                                <p className="mt-2 text-xs text-ink-secondary dark:text-dark-subtext">

                                  Source :
                                  {' '}
                                  {item.source}

                                </p>

                                {/* PROGRESSION */}

                                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">

                                  <div

                                    className="h-full rounded-full bg-secondary"

                                    style={{
                                      width:
                                        `${item.progress}%`,
                                    }}

                                  />

                                </div>

                                {/* RESPONSABLE + DATE */}

                                <div className="mt-4 flex flex-col gap-2 text-xs text-ink-secondary dark:text-dark-subtext">

                                  <span className="flex items-center gap-1.5">

                                    <Icon
                                      name="User"
                                      size={12}
                                    />

                                    <span className="truncate">

                                      {item.owner}

                                    </span>

                                  </span>

                                  <span className="flex items-center gap-1.5">

                                    <Icon
                                      name="Calendar"
                                      size={12}
                                    />

                                    {item.dueDate

                                      ? new Date(
                                          item.dueDate
                                        ).toLocaleDateString(
                                          'fr-FR'
                                        )

                                      : '—'}

                                  </span>

                                </div>

                                {/* STATUS */}

                                <div className="mt-4">

                                  <span
                                    className={cn(
                                      'inline-flex rounded-full px-2 py-1 text-[11px] font-semibold',

                                      item.status ===
                                        'Ouverte'
                                        ? 'bg-info/10 text-info'

                                        : item.status ===
                                          'Terminé'
                                          ? 'bg-success/10 text-success'

                                          : 'bg-danger/10 text-danger'
                                    )}
                                  >

                                    {item.status}

                                  </span>

                                </div>

                              </Card>

                            </motion.div>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="rounded-xl border border-dashed border-surface-border py-8 text-center text-xs text-ink-secondary dark:border-dark-border dark:text-dark-subtext">

                        Aucune CAPA

                      </div>

                    )}

                  </div>

                );
              }
            )}

          </div>

        )}

      {/* ==================================================
          LIST
      ================================================== */}

      {!loading &&
        view === 'list' && (

          <Card className="divide-y divide-surface-border dark:divide-dark-border">

            {capaCards.map(
              (item) => (

                <div

                  key={item.id}

                  onClick={() =>
                    handleOpenAction(
                      item.capa,
                      item.action,
                      item.actionIndex
                    )
                  }

                  className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"

                >

                  <div className="flex min-w-0 flex-1 items-center gap-3">

                    {/* CORBEILLE */}

                    <button

                      type="button"

                      onClick={(event) =>
                        handleAskDeleteAction(
                          event,
                          item.capa,
                          item.action,
                          item.actionIndex
                        )
                      }

                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-danger/10 hover:text-danger dark:text-dark-subtext"

                      title="Supprimer cette action"

                    >

                      <Icon
                        name="Trash2"
                        size={16}
                      />

                    </button>

                    <div className="min-w-0">

                      <p className="font-mono text-xs font-semibold text-primary">

                        {item.reference}

                      </p>

                      <p className="truncate text-sm font-medium text-ink-primary dark:text-dark-text">

                        {item.title}

                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <Badge
                      tone={
                        priorityTone[
                          item.priority
                        ]
                      }
                    >

                      {item.priority}

                    </Badge>

                    <span className="text-xs text-ink-secondary dark:text-dark-subtext">

                      {item.owner}

                    </span>

                    <span className="text-xs text-ink-secondary dark:text-dark-subtext">

                      {item.dueDate

                        ? new Date(
                            item.dueDate
                          ).toLocaleDateString(
                            'fr-FR'
                          )

                        : '—'}

                    </span>

                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-[11px] font-semibold',

                        item.status ===
                          'Ouverte'
                          ? 'bg-info/10 text-info'

                          : item.status ===
                            'Terminé'
                            ? 'bg-success/10 text-success'

                            : 'bg-danger/10 text-danger'
                      )}
                    >

                      {item.status}

                    </span>

                  </div>

                </div>

              )
            )}

            {capaCards.length === 0 && (

              <div className="px-5 py-10 text-center">

                <p className="text-sm text-ink-secondary dark:text-dark-subtext">

                  Aucune CAPA

                </p>

              </div>

            )}

          </Card>

        )}

      {/* ==================================================
          TIMELINE
      ================================================== */}

      {!loading &&
        view === 'timeline' && (

          <Card className="p-6">

            <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-surface-border dark:before:bg-dark-border">

              {[...capaCards]

                .sort(
                  (a, b) =>
                    a.dueDate.localeCompare(
                      b.dueDate
                    )
                )

                .map(
                  (item) => (

                    <div

                      key={item.id}

                      onClick={() =>
                        handleOpenAction(
                          item.capa,
                          item.action,
                          item.actionIndex
                        )
                      }

                      className="relative cursor-pointer rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"

                    >

                      {/* POINT */}

                      <span

                        className={cn(

                          'absolute -left-6 top-3 h-3.5 w-3.5 rounded-full ring-4 ring-surface-card dark:ring-dark-card',

                          item.status ===
                            'Terminé'

                            ? 'bg-success'

                            : item.status ===
                              'Expiré'

                              ? 'bg-danger'

                              : item.priority ===
                                'Critique'

                                ? 'bg-danger'

                                : 'bg-primary'

                        )}

                      />

                      {/* CORBEILLE */}

                      <button

                        type="button"

                        onClick={(event) =>
                          handleAskDeleteAction(
                            event,
                            item.capa,
                            item.action,
                            item.actionIndex
                          )
                        }

                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-danger/10 hover:text-danger dark:text-dark-subtext"

                        title="Supprimer cette action"

                      >

                        <Icon
                          name="Trash2"
                          size={16}
                        />

                      </button>

                      <p className="pr-10 text-xs text-ink-secondary dark:text-dark-subtext">

                        {item.dueDate

                          ? new Date(
                              item.dueDate
                            ).toLocaleDateString(
                              'fr-FR',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              }
                            )

                          : 'Sans échéance'}

                      </p>

                      <p className="pr-10 text-sm font-medium text-ink-primary dark:text-dark-text">

                        {item.title}

                      </p>

                      <p className="text-xs text-ink-secondary dark:text-dark-subtext">

                        {item.reference}
                        {' · '}
                        {item.owner}

                      </p>

                    </div>

                  )
                )}

            </div>

          </Card>

        )}

    </div>
  );
}

