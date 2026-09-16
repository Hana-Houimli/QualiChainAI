import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge, Badge } from '../../components/ui/Badge';

import {
  DataTable,
  type Column,
} from '../../components/shared/DataTable';

import type { AuditItem, AuditFormData, AuditType } from '../../types';
import { auditService } from '../../services';


// ==========================================================
// TYPES AUDIT
// ==========================================================

const auditTypes: AuditType[] = [
  'Audit transport pharmaceutique',
  'Audit système qualité',
  'Audit conformité réglementaire',
  'Audit fournisseur pharmaceutique',
  'Audit entrepôt de stockage pharmaceutique',
  'Audit distributeur pharmaceutique',
  'Audit chaîne du froid pharmaceutique',
];


// ==========================================================
// SITES
// ==========================================================

const SITES_PHARMACEUTIQUES = [
  'Dépôt central Tunis',
  'Entrepôt Ariana',
  'Centre de distribution Sousse',
  'Plateforme logistique Sfax',
  'Entrepôt frigorifique Monastir',
  'Grossiste répartiteur Nord',
  'Grossiste répartiteur Sud',
  'Sous-traitant transport pharmaceutique',
  'Fournisseur médicaments',
  'Fournisseur dispositifs médicaux',
  'Site de stockage vaccins',
  'Pharmacie hospitalière',
  'Centre de distribution régional',
  'Entrepôt produits thermosensibles',
  'Prestataire logistique GDP',
];


// ==========================================================
// FORMULAIRE PAR DEFAUT
// ==========================================================

const defaultForm: AuditFormData = {
  type: auditTypes[0],
  site: '',
  auditor: 'Hana Houimli',
  date: '',
};

// ==========================================================
// COMPOSANT
// ==========================================================

export default function AuditsList() {

  const navigate = useNavigate();

  // --------------------------------------------------------
  // STATES
  // --------------------------------------------------------

  const [view, setView] =
    useState<'list' | 'calendar'>('list');

  const [isCreating, setIsCreating] =
    useState(false);

  const [auditItems, setAuditItems] =
    useState<AuditItem[]>([]);

  const [formData, setFormData] =
    useState(defaultForm);

  const [statusFilter, setStatusFilter] =
    useState('Tous');

  const [typeFilter, setTypeFilter] =
    useState('Tous');

  const [currentPage, setCurrentPage] =
    useState(1);

  const ITEMS_PER_PAGE = 5;

  const siteOptions =
    SITES_PHARMACEUTIQUES;


  // ========================================================
  // RECUPERER LES AUDITS
  // ========================================================

  useEffect(() => {
  const fetchAudits = async () => {
    try {
      const audits =
        await auditService.getAll();

      setAuditItems(audits);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des audits :',
        error
      );
    }
  };

  fetchAudits();
}, []);


  // ========================================================
  // SUPPRIMER UN AUDIT
  // ========================================================

  const handleDeleteAudit = async (
  auditId: string
) => {
  const confirmed = window.confirm(
    'Êtes-vous sûr de vouloir supprimer cet audit ?'
  );

  if (!confirmed) {
    return;
  }

  try {
    await auditService.delete(auditId);

    setAuditItems((prev) =>
      prev.filter(
        (audit) => audit.id !== auditId
      )
    );
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'audit :",
      error
    );

    window.alert(
      "Impossible de supprimer l'audit."
    );
  }
};

  // ========================================================
  // COLONNES
  // ========================================================

  const columns: Column<AuditItem>[] = [

    {
      header: 'Référence',

      accessor: (r) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {r.reference}
        </span>
      ),
    },

    {
      header: 'Titre',

      accessor: (r) => (
        <span className="font-medium">
          {r.title}
        </span>
      ),
    },

    {
      header: 'Site',

      accessor: (r) =>
        r.site,
    },

    {
      header: 'Type',

      accessor: (r) => (
        <Badge tone="neutral">
          {r.type}
        </Badge>
      ),
    },

    {
      header: 'Auditeur',

      accessor: (r) =>
        r.auditor,
    },

    {
      header: 'Score',

      accessor: (r) =>
        r.score !== null &&
        r.score !== undefined
          ? `${r.score}%`
          : '—',
    },

    {
      header: 'Date',

      accessor: (r) =>
        r.date
          ? new Date(
              r.date
            ).toLocaleDateString('fr-FR')
          : '—',
    },

    {
      header: 'Statut',

      accessor: (r) => (
        <StatusBadge
          status={r.status}
        />
      ),
    },

    // ======================================================
    // NOUVELLE COLONNE : SUPPRESSION
    // ======================================================

    {
      header: 'Actions',

      className: 'text-center',

      accessor: (r) => (

        <button
          type="button"

          onClick={(event) => {

            // Empêche le onRowClick du DataTable
            event.stopPropagation();

            handleDeleteAudit(r.id);

          }}

          className="inline-flex items-center justify-center rounded-lg p-2 text-danger hover:bg-red-50 dark:hover:bg-red-500/10"

          title="Supprimer l'audit"

        >

          <Icon
            name="Trash2"
            size={16}
          />

        </button>

      ),
    },

  ];


  // ========================================================
  // FILTRAGE
  // ========================================================

  const filteredAudits =
    auditItems.filter((audit) => {

      const matchesStatus =
        statusFilter === 'Tous' ||
        audit.status === statusFilter;

      const matchesType =
        typeFilter === 'Tous' ||
        audit.type === typeFilter;

      return (
        matchesStatus &&
        matchesType
      );

    });


  // ========================================================
  // PAGINATION
  // ========================================================

  const totalPages =
    Math.ceil(
      filteredAudits.length /
      ITEMS_PER_PAGE
    );


  const paginatedAudits =
    filteredAudits.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage *
        ITEMS_PER_PAGE
    );


  // ========================================================
  // RESET PAGE FILTRE
  // ========================================================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    statusFilter,
    typeFilter,
  ]);


  // ========================================================
  // CREER UN AUDIT
  // ========================================================

  const handleCreateAudit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    const tempId =
      `tmp-${Date.now()}`;

    try {

      const tempAudit: AuditItem = {

        id:
          tempId,

        reference:
          'Génération...',

        title:
          `${formData.type} - ${formData.site}`,

        site:
          formData.site,

        auditor:
          formData.auditor,

        type:
          formData.type,

        status:
          'brouillon',

        score:
          null,

        date:
          formData.date,

      };

      setAuditItems(
        (prev) => [
          tempAudit,
          ...prev,
        ]
      );

      setIsCreating(false);


      // ----------------------------------------------------
      // APPEL BACKEND
      // ----------------------------------------------------

      

      const data =
          await auditService.generate({
            type_audit: formData.type,
            site_audit: formData.site,
            responsable: formData.auditor,
            date_audit: formData.date,
          });

      if (!data.audit_id) {

        throw new Error(
          'audit_id absent de la réponse du serveur'
        );

      }


      // ----------------------------------------------------
      // REMPLACER L'AUDIT TEMPORAIRE
      // ----------------------------------------------------

      setAuditItems(
        (prev) =>
          prev.map((audit) =>

            audit.id === tempId

              ? {

                  ...audit,

                  id:
                    data.audit_id,

                  reference:
                    data.audit_id,

                  status:
                    'en cours',

                }

              : audit

          )
      );


    } catch (error) {

      console.error(
        'Erreur lors de la génération de la checklist :',
        error
      );

      setAuditItems(
        (prev) =>
          prev.map((audit) =>

            audit.id === tempId

              ? {

                  ...audit,

                  status:
                    'error',

                }

              : audit

          )
      );

    }

  };


  // ========================================================
  // PAGE PRECEDENTE
  // ========================================================

  const goToPreviousPage = () => {

    setCurrentPage(
      (page) =>
        Math.max(
          1,
          page - 1
        )
    );

  };


  // ========================================================
  // PAGE SUIVANTE
  // ========================================================

  const goToNextPage = () => {

    setCurrentPage(
      (page) =>
        Math.min(
          totalPages,
          page + 1
        )
    );

  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <PageHeader

        title="Audits"

        description=
          "Planification, exécution et suivi des audits qualité"

        actions={

          <>

            {/* LISTE / CALENDRIER */}

            <div className="flex rounded-xl border border-surface-border p-1 dark:border-dark-border">

              <button

                onClick={() =>
                  setView('list')
                }

                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  view === 'list'
                    ? 'bg-primary text-white'
                    : 'text-ink-secondary dark:text-dark-subtext'
                }`}

              >

                Liste

              </button>


              <button

                onClick={() =>
                  setView('calendar')
                }

                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  view === 'calendar'
                    ? 'bg-primary text-white'
                    : 'text-ink-secondary dark:text-dark-subtext'
                }`}

              >

                Calendrier

              </button>

            </div>


            {/* NOUVEL AUDIT */}

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

              Nouvel audit

            </Button>

          </>

        }

      />


      {/* ==================================================
          FILTRES
      ================================================== */}

      <div className="flex flex-wrap items-center gap-3">

        {/* FILTRE STATUT */}

        <select

          value={statusFilter}

          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }

          className="h-9 rounded-xl border border-surface-border bg-surface-card px-3 text-xs font-medium text-ink-primary dark:border-dark-border dark:bg-dark-card dark:text-dark-text"

        >

          <option value="Tous">
            Tous les statuts
          </option>

          <option value="brouillon">
            Brouillon
          </option>

          <option value="en cours">
            En cours
          </option>

          <option value="terminé">
            Terminé
          </option>

          <option value="error">
            Erreur
          </option>

        </select>


        {/* FILTRE TYPE */}

        <select

          value={typeFilter}

          onChange={(event) =>
            setTypeFilter(
              event.target.value
            )
          }

          className="h-9 rounded-xl border border-surface-border bg-surface-card px-3 text-xs font-medium text-ink-primary dark:border-dark-border dark:bg-dark-card dark:text-dark-text"

        >

          <option value="Tous">
            Tous les types
          </option>

          {auditTypes.map(
            (type) => (

              <option
                key={type}
                value={type}
              >
                {type}
              </option>

            )
          )}

        </select>


        {/* RESET FILTRES */}

        {(statusFilter !== 'Tous' ||
          typeFilter !== 'Tous') && (

          <Button

            variant="ghost"

            size="sm"

            onClick={() => {

              setStatusFilter(
                'Tous'
              );

              setTypeFilter(
                'Tous'
              );

            }}

          >

            <Icon
              name="X"
              size={14}
            />

            Réinitialiser

          </Button>

        )}


        {/* ACTIONS A DROITE */}

        <div className="ml-auto flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
          >

            <Icon
              name="Filter"
              size={14}
            />

            Filtres

          </Button>


          <Button
            variant="outline"
            size="sm"
          >

            <Icon
              name="Download"
              size={14}
            />

            Export

          </Button>

        </div>

      </div>


      {/* ==================================================
          MODAL CREATION
      ================================================== */}

      {isCreating && (

        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">

          <div className="w-full max-w-2xl rounded-3xl border border-surface-border bg-surface-card p-6 shadow-elevated dark:border-dark-border dark:bg-dark-card">

            {/* HEADER MODAL */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <h3 className="text-lg font-semibold text-ink-primary dark:text-dark-text">

                  Créer un nouvel audit

                </h3>

                <p className="mt-1 text-sm text-ink-secondary dark:text-dark-subtext">

                  Renseignez les informations obligatoires pour planifier l’audit.

                </p>

              </div>


              <button

                type="button"

                onClick={() =>
                  setIsCreating(false)
                }

                className="rounded-lg p-2 text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5"

              >

                <Icon
                  name="X"
                  size={18}
                />

              </button>

            </div>


            {/* FORMULAIRE */}

            <form

              className="mt-6 space-y-4"

              onSubmit={
                handleCreateAudit
              }

            >

              <div className="grid gap-4 md:grid-cols-2">

                {/* TYPE */}

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">

                  <span>

                    Type d’audit

                    <span className="text-danger">
                      *
                    </span>

                  </span>


                  <select

                    required

                    value={
                      formData.type
                    }

                    onChange={(event) =>
                      setFormData(
                        (prev) => ({
                          ...prev,

                          type:
                            event.target.value as AuditType,

                        })
                      )
                    }

                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"

                  >

                    {auditTypes.map(
                      (type) => (

                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>

                      )
                    )}

                  </select>

                </label>


                {/* SITE */}

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">

                  <span>

                    Site

                    <span className="text-danger">
                      *
                    </span>

                  </span>


                  <select

                    required

                    value={
                      formData.site
                    }

                    onChange={(event) =>
                      setFormData(
                        (prev) => ({
                          ...prev,

                          site:
                            event.target.value,

                        })
                      )
                    }

                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"

                  >

                    <option value="">
                      Sélectionner un site
                    </option>

                    {siteOptions.map(
                      (site) => (

                        <option
                          key={site}
                          value={site}
                        >
                          {site}
                        </option>

                      )
                    )}

                  </select>

                </label>


                {/* AUDITEUR */}

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">

                  <span>

                    Auditeur

                    <span className="text-danger">
                      *
                    </span>

                  </span>


                  <input

                    required

                    type="text"

                    value={
                      formData.auditor
                    }

                    onChange={(event) =>
                      setFormData(
                        (prev) => ({
                          ...prev,

                          auditor:
                            event.target.value,

                        })
                      )
                    }

                    placeholder="Ex. Hana Houimli"

                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"

                  />

                </label>


                {/* DATE */}

                <label className="space-y-2 text-sm font-medium text-ink-primary dark:text-dark-text">

                  <span>

                    Date de l’audit

                    <span className="text-danger">
                      *
                    </span>

                  </span>


                  <input

                    required

                    type="date"

                    value={
                      formData.date
                    }

                    onChange={(event) =>
                      setFormData(
                        (prev) => ({
                          ...prev,

                          date:
                            event.target.value,

                        })
                      )
                    }

                    className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg px-3 text-sm dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"

                  />

                </label>

              </div>


              {/* BOUTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <Button

                  type="button"

                  variant="outline"

                  onClick={() =>
                    setIsCreating(false)
                  }

                >

                  Annuler

                </Button>


                <Button

                  type="submit"

                  variant="primary"

                >

                  Créer checklist

                </Button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ==================================================
          LISTE
      ================================================== */}

      {view === 'list' ? (

        <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card dark:border-dark-border dark:bg-dark-card">

          <DataTable

            columns={columns}

            data={paginatedAudits}

            onRowClick={(audit) => {

              navigate(
                `/audits/${audit.id}`
              );

            }}

          />


          {/* PAGINATION */}

          {filteredAudits.length > 0 && (

            <div className="flex items-center justify-between border-t border-surface-border px-5 py-4 dark:border-dark-border">

              <p className="text-xs text-ink-secondary dark:text-dark-subtext">

                {(
                  (currentPage - 1) *
                    ITEMS_PER_PAGE
                ) + 1}

                {' – '}

                {Math.min(
                  currentPage *
                    ITEMS_PER_PAGE,

                  filteredAudits.length
                )}

                {' sur '}

                {filteredAudits.length}

                {' audit'}

                {filteredAudits.length > 1
                  ? 's'
                  : ''}

              </p>


              <div className="flex items-center gap-2">

                <Button

                  variant="outline"

                  size="icon"

                  disabled={
                    currentPage === 1
                  }

                  onClick={
                    goToPreviousPage
                  }

                >

                  <Icon
                    name="ChevronLeft"
                    size={16}
                  />

                </Button>


                <span className="min-w-[80px] text-center text-xs font-medium text-ink-secondary dark:text-dark-subtext">

                  Page {currentPage}
                  {' / '}
                  {totalPages}

                </span>


                <Button

                  variant="outline"

                  size="icon"

                  disabled={
                    currentPage ===
                    totalPages
                  }

                  onClick={
                    goToNextPage
                  }

                >

                  <Icon
                    name="ChevronRight"
                    size={16}
                  />

                </Button>

              </div>

            </div>

          )}


          {/* AUCUN RESULTAT */}

          {filteredAudits.length === 0 && (

            <div className="px-5 py-10 text-center">

              <Icon
                name="FileText"
                size={30}
              />

              <p className="mt-3 text-sm font-medium text-ink-primary dark:text-dark-text">

                Aucun audit trouvé

              </p>

              <p className="mt-1 text-xs text-ink-secondary dark:text-dark-subtext">

                Aucun audit ne correspond aux filtres sélectionnés.

              </p>

            </div>

          )}

        </div>

      ) : (

        /* =================================================
           CALENDRIER
        ================================================= */

        <div className="grid grid-cols-7 gap-2 rounded-2xl border border-surface-border bg-surface-card p-4 dark:border-dark-border dark:bg-dark-card">

          {/* JOURS */}

          {[
            'Lun',
            'Mar',
            'Mer',
            'Jeu',
            'Ven',
            'Sam',
            'Dim',
          ].map((day) => (

            <div

              key={day}

              className="pb-2 text-center text-xs font-semibold text-ink-secondary dark:text-dark-subtext"

            >

              {day}

            </div>

          ))}


          {/* JOURS DU MOIS */}

          {Array.from({
            length: 31,
          }).map((_, i) => {

            const day =
              i + 1;


            const dayAudits =
              filteredAudits.filter(
                (audit) => {

                  if (!audit.date) {
                    return false;
                  }

                  return (
                    new Date(
                      audit.date
                    ).getDate() === day
                  );

                }
              );


            return (

              <div

                key={i}

                className="min-h-[84px] rounded-xl border border-surface-border p-2 text-xs dark:border-dark-border"

              >

                <span className="font-semibold text-ink-secondary dark:text-dark-subtext">

                  {day}

                </span>


                {dayAudits.map(
                  (audit) => (

                    <div

                      key={audit.id}

                      onClick={() =>
                        navigate(
                          `/audits/${audit.id}`
                        )
                      }

                      className="mt-1 cursor-pointer truncate rounded-md bg-primary-50 px-1.5 py-1 text-[10px] font-medium text-primary hover:opacity-80 dark:bg-primary/15 dark:text-primary-100"

                    >

                      {audit.reference}

                    </div>

                  )
                )}

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}