import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  Audit,
  CapaPlan
} from '../../types';
import {
  auditService, capaService , reportService } from '../../services'





export default function AuditDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState<number | null>(0);

  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState<
  'checklist' | 'analysis' | 'capa_plan'
>('checklist');
  const [checklistModified, setChecklistModified] = useState(false);
  const [capaPlan, setCapaPlan] = useState<CapaPlan | null>(null);
  const [generatingReport, setGeneratingReport] =
  useState(false);

  const [reportGenerated, setReportGenerated] =
  useState(false);
  
  /*
   * Normalisation du résultat.
   *
   * MongoDB peut contenir :
   * "Conforme"
   * "Non conforme"
   * "NA"
   *
   * On transforme seulement pour comparer.
   * On ne modifie PAS la valeur stockée dans audit.
   */
  const normalizeResult = (resultat?: string) => {
    return resultat
      ?.trim()
      .toLowerCase()
      .replace(/_/g, ' ');
  };

  useEffect(() => {
  if (!id) return;

  const fetchAudit = async () => {
    try {
      setLoading(true);

      const data =
        await auditService.getById(id);

      setAudit(data);

      try {
        const capaData =
          await capaService.getByAudit(id);

        setCapaPlan(capaData);
      } catch (capaError) {
        console.error(
          'Erreur récupération CAPA :',
          capaError
        );

        setCapaPlan(null);
      }
    } catch (error) {
      console.error(
        'Erreur récupération audit :',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  fetchAudit();
}, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-ink-secondary">
          Chargement de l'audit...
        </p>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="space-y-4 p-6">
        <button
          onClick={() => navigate('/audits')}
          className="text-sm text-primary"
        >
          ← Retour aux audits
        </button>

        <p className="text-danger">
          Audit introuvable.
        </p>
      </div>
    );
  }

  /*
   * Tous les points
   */
  const allPoints = audit.sections.flatMap(
    section => section.points_controle
  );

  const totalPoints = allPoints.length;

  /*
   * IMPORTANT :
   * On utilise normalizeResult()
   * pour gérer "Conforme", "conforme",
   * "Non conforme", "non_conforme", etc.
   */
  const conformes = allPoints.filter(
    point =>
      normalizeResult(point.resultat) === 'conforme'
  ).length;

  const nonConformes = allPoints.filter(
    point =>
      normalizeResult(point.resultat) === 'non conforme'
  ).length;

  const na = allPoints.filter(
    point =>
      normalizeResult(point.resultat) === 'non applicable'
  ).length;

  const answered =
    conformes + nonConformes + na;

  const progression =
    totalPoints > 0
      ? Math.round(
          (answered / totalPoints) * 100
        )
      : 0;

  /*
   * Ce score sert uniquement pour
   * les statistiques de la checklist.
   *
   * L'analyse MongoDB reste affichée
   * depuis audit.analysis.
   */
  const score =
  conformes + nonConformes > 0
    ? Number(
        (
          (conformes / (conformes + nonConformes)) * 100
        ).toFixed(2)
      )
    : 0;

  /*
   * Modifier le résultat
   */
  const handleResultChange = (
    sectionIndex: number,
    pointIndex: number,
    resultat: string
  ) => {
    setChecklistModified(true);

    setAudit(prev => {
      if (!prev) return prev;

      return {
        ...prev,

        sections: prev.sections.map(
          (section, sIndex) => {
            if (sIndex !== sectionIndex) {
              return section;
            }

            return {
              ...section,

              points_controle:
                section.points_controle.map(
                  (point, pIndex) =>
                    pIndex === pointIndex
                      ? {
                          ...point,
                          resultat
                        }
                      : point
                )
            };
          }
        )
      };
    });
  };

  /*
   * Modifier le commentaire
   */
  const handleCommentChange = (
    sectionIndex: number,
    pointIndex: number,
    commentaire: string
  ) => {
    setChecklistModified(true);
    setAudit(prev => {
      if (!prev) return prev;

      return {
        ...prev,

        sections: prev.sections.map(
          (section, sIndex) => {
            if (sIndex !== sectionIndex) {
              return section;
            }

            return {
              ...section,

              points_controle:
                section.points_controle.map(
                  (point, pIndex) =>
                    pIndex === pointIndex
                      ? {
                          ...point,
                          commentaire
                        }
                      : point
                )
            };
          }
        )
      };
    });
  };

  /*
   * Pour l'instant on garde ton handleSave.
   *
   * On ne touche PAS au backend maintenant,
   * comme demandé.
   */
  const handleSave = async () => {
  if (!audit) return;

  try {
    await auditService.update(
      audit.audit_id,
      {
        sections: audit.sections,
        status: audit.status,
        date_audit: audit.date_audit,
        responsable: audit.responsable,
      }
    );

    if (checklistModified) {
      await auditService.analyze(
        audit.audit_id
      );

      await capaService.generateForAudit(
        audit.audit_id
      );

      const capaData =
        await capaService.getByAudit(
          audit.audit_id
        );

      setCapaPlan(capaData);
    }

    const updatedAudit =
      await auditService.getById(
        audit.audit_id
      );

    setAudit(updatedAudit);

    setChecklistModified(false);
    setIsEditing(false);

    alert(
      checklistModified
        ? 'Audit, analyse et CAPA enregistrés avec succès'
        : 'Audit enregistré avec succès'
    );
  } catch (error) {
    console.error(
      'Erreur sauvegarde audit :',
      error
    );

    alert(
      "Erreur lors de l'enregistrement de l'audit"
    );
  }
};

const handleGenerateReport = async () => {
  if (!audit) return;

  if (!audit.analysis) {
    alert(
      "L'analyse doit être générée avant le rapport."
    );
    return;
  }

  if (!capaPlan) {
    alert(
      "Le plan CAPA doit être généré avant le rapport."
    );
    return;
  }

  try {
    setGeneratingReport(true);

    const data =
      await reportService.generate(
        audit.audit_id
      );

    setAudit((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        status: 'Terminé',
      };
    });

    setReportGenerated(true);

    alert(
      `Rapport ${data.report_id} généré avec succès.\n\n` +
      `Vous pouvez maintenant le consulter dans la page Reports.`
    );
  } catch (error) {
    console.error(
      'Erreur génération rapport :',
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : 'Erreur lors de la génération du rapport.'
    );
  } finally {
    setGeneratingReport(false);
  }
};


  return (
    <div className="space-y-6">

      {/* RETOUR */}

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/audits')}
          className="text-sm font-medium text-ink-secondary hover:text-primary"
        >
          ← Retour aux audits
        </button>
      </div>

      {/* INFORMATIONS AUDIT */}

      <div className="rounded-2xl border border-surface-border bg-surface-card p-6 dark:border-dark-border dark:bg-dark-card">

        <div className="flex items-start justify-between gap-4">

  {/* INFORMATIONS AUDIT */}

  <div>
    <p className="font-mono text-sm font-semibold text-primary">
      {audit.audit_id}
    </p>

    <h1 className="mt-1 text-2xl font-bold text-ink-primary dark:text-dark-text">
      {audit.type_audit}
    </h1>
  </div>


  {/* STATUS + RAPPORT */}

  <div className="flex items-center gap-3">

    {/* STATUS */}

    <span
      className={
        audit.status === 'Terminé'
          ? 'rounded-lg bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-500'
          : 'rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-500'
      }
    >
      {audit.status}
    </span>


    {/* GENERER RAPPORT */}

    {audit.analysis && capaPlan && (

      <button
        onClick={handleGenerateReport}
        disabled={generatingReport}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {generatingReport
          ? '⏳ Génération...'
          : '📄 Générer le rapport'
        }
      </button>

    )}

  </div>

</div>

        <div className="mt-6 grid gap-5 md:grid-cols-4">

          <div>
            <p className="text-xs text-ink-secondary">
              Site audit
            </p>

            <p className="mt-1 font-semibold">
              📍 {audit.site_audit}
            </p>
          </div>

          <div>
            <p className="text-xs text-ink-secondary">
              Date de création
            </p>

            <p className="mt-1 font-semibold">
              {audit.date_creation
                ? new Date(
                    audit.date_creation
                  ).toLocaleDateString('fr-FR')
                : '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-ink-secondary">
              Date de l'audit
            </p>

            <input
              type="date"
              value={audit.date_audit}
              disabled={!isEditing}
              onChange={e =>
                setAudit({
                  ...audit,
                  date_audit: e.target.value
                })
              }
              className="mt-1 h-10 rounded-xl border border-surface-border bg-transparent px-3"
            />
          </div>

          <div>
            <p className="text-xs text-ink-secondary">
              Responsable
            </p>

            <input
              type="text"
              value={audit.responsable}
              disabled={!isEditing}
              onChange={e =>
                setAudit({
                  ...audit,
                  responsable: e.target.value
                })
              }
              className="mt-1 h-10 w-full rounded-xl border border-surface-border bg-transparent px-3"
            />
          </div>

        </div>
      </div>

      {/* STATISTIQUES */}

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-xl border p-5">
          <p className="text-sm text-ink-secondary">
            Progression
          </p>

          <p className="mt-1 text-2xl font-bold">
            {progression}%
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-ink-secondary">
            Score conformité
          </p>

          <p className="mt-1 text-2xl font-bold text-green-500">
            {score}%
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-ink-secondary">
            Conformes / Non conf.
          </p>

          <p className="mt-1 text-2xl font-bold">
            <span className="text-green-500">
              {conformes}
            </span>

            {' / '}

            <span className="text-red-500">
              {nonConformes}
            </span>
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-ink-secondary">
            Points de contrôle
          </p>

          <p className="mt-1 text-2xl font-bold">
            {answered}/{totalPoints}
          </p>
        </div>

      </div>

      {/* ONGLETS */}

      <div>

        <div className="mb-4 flex gap-2">

          <button
            onClick={() =>
              setActiveTab('checklist')
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === 'checklist'
                ? 'bg-primary text-white'
                : 'border border-surface-border'
            }`}
          >
            Checklist
          </button>

          <button
            onClick={() =>
              setActiveTab('analysis')
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === 'analysis'
                ? 'bg-primary text-white'
                : 'border border-surface-border'
            }`}
          >
            Analyse
          </button>

          <button
          onClick={() =>
            setActiveTab('capa_plan')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === 'capa_plan'
                ? 'bg-primary text-white'
                : 'border border-surface-border'
            }`}
          >
            Plan CAPA
          </button>

        </div>

        {/* BOUTONS */}



        {/* ================================================= */}
        {/* CHECKLIST */}
        {/* ================================================= */}

{activeTab === 'checklist' && (
  <>
    {/* BOUTONS ACTIONS */}
    <div className="mb-6 flex justify-end gap-2">

      {isEditing ? (
        <button
          onClick={handleSave}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          💾 Enregistrer
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-xl border border-surface-border px-4 py-2 text-sm font-semibold transition hover:bg-slate-500/10"
        >
          ✏ Modifier
        </button>
      )}

      <button
        onClick={() => {
          window.open(
            auditService.getPdfUrl(audit.audit_id),
            '_blank'
          );
        }}
        className="rounded-xl border border-surface-border px-4 py-2 text-sm font-semibold hover:bg-slate-500/10"
      >
        🖨 Exporter PDF
      </button>

    </div>

    {/* CHECKLIST */}
    <div>

      {audit.sections.map((section, sectionIndex) => {

        const isOpen = activeSection === sectionIndex;

        return (
          <div
            key={sectionIndex}
            className="mb-4 overflow-hidden rounded-2xl border border-surface-border dark:border-dark-border"
          >

            {/* SECTION HEADER */}
            <button
              onClick={() =>
                setActiveSection(
                  isOpen ? null : sectionIndex
                )
              }
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >

              <div className="flex items-center gap-3">

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {sectionIndex + 1}
                </span>

                <span className="font-semibold">
                  {section.nom_section}
                </span>

              </div>

              <span>
                {isOpen ? '⌃' : '⌄'}
              </span>

            </button>

            {/* POINTS */}
            {isOpen && (
              <div className="border-t">

                {section.points_controle.map(
                  (point, pointIndex) => {

                    const result = normalizeResult(
                      point.resultat
                    );

                    return (
                      <div
                        key={pointIndex}
                        className="border-b p-5 last:border-b-0"
                      >

                        {/* QUESTION */}
                        <p className="font-semibold">
                          {sectionIndex + 1}.
                          {pointIndex + 1}{' '}
                          {point.question}
                        </p>

                        {/* CRITICITE */}
                        <div className="mt-3">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              point.criticite === 'Critique'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}
                          >
                            {point.criticite}
                          </span>

                        </div>

                        {/* PREUVE */}
                        <div className="mt-3 rounded-lg bg-slate-500/5 p-3 text-sm">

                          <span className="font-semibold">
                            Preuve attendue :
                          </span>{' '}

                          {point.preuve_attendue}

                        </div>

                        {/* RESULTAT */}
                        <div className="mt-4 flex flex-wrap gap-2">

                          {/* CONFORME */}
                          <button
                            disabled={!isEditing}
                            onClick={() =>
                              handleResultChange(
                                sectionIndex,
                                pointIndex,
                                'Conforme'
                              )
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                              result === 'conforme'
                                ? 'border-green-500 bg-green-500/10 text-green-500'
                                : 'border-surface-border'
                            }`}
                          >
                            ✓ Conforme
                          </button>

                          {/* NON CONFORME */}
                          <button
                            disabled={!isEditing}
                            onClick={() =>
                              handleResultChange(
                                sectionIndex,
                                pointIndex,
                                'Non conforme'
                              )
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                              result === 'non conforme'
                                ? 'border-red-500 bg-red-500/10 text-red-500'
                                : 'border-surface-border'
                            }`}
                          >
                            ⊗ Non conforme
                          </button>

                          {/* N/A */}
                          <button
                            disabled={!isEditing}
                            onClick={() =>
                              handleResultChange(
                                sectionIndex,
                                pointIndex,
                                'Non applicable'
                              )
                            }
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                              result === 'na'
                                ? 'border-slate-500 bg-slate-500/10'
                                : 'border-surface-border'
                            }`}
                          >
                            — N/A
                          </button>

                        </div>

                        {/* COMMENTAIRE */}
                        <textarea
                          value={point.commentaire ?? ''}
                          disabled={!isEditing}
                          onChange={e =>
                            handleCommentChange(
                              sectionIndex,
                              pointIndex,
                              e.target.value
                            )
                          }
                          placeholder="Observation, preuve ou commentaire..."
                          className="mt-4 min-h-[80px] w-full rounded-xl border border-surface-border bg-transparent p-3 text-sm outline-none focus:border-primary"
                        />

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>
        );
      })}

    </div>
  </>
)}

        {/* ================================================= */}
        {/* ANALYSE */}
        {/* ================================================= */}

        {activeTab === 'analysis' && (
          <div className="space-y-6">

            {!audit.analysis ? (
              <div className="rounded-2xl border p-6">
                <p className="text-sm text-ink-secondary">
                  Aucune analyse disponible pour cet audit.
                </p>
              </div>
            ) : (
              <>
                {/* SCORE GLOBAL */}

                <div className="rounded-2xl border border-surface-border bg-surface-card p-6 dark:border-dark-border dark:bg-dark-card">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-ink-secondary">
                        Score de conformité
                      </p>

                      <p className="mt-2 text-4xl font-bold text-green-500">
                        {
                          audit.analysis
                            .score_conformite
                        }%
                      </p>

                    </div>

                    <span className="rounded-xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-500">
                      {
                        audit.analysis
                          .statut_global
                      }
                    </span>

                  </div>

                </div>

                {/* RESUME */}

                <div className="grid gap-4 md:grid-cols-4">

                  <div className="rounded-xl border p-5">

                    <p className="text-sm text-ink-secondary">
                      Total points
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        audit.analysis
                          .resume.total_points
                      }
                    </p>

                  </div>

                  <div className="rounded-xl border p-5">

                    <p className="text-sm text-ink-secondary">
                      Conformes
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-500">
                      {
                        audit.analysis
                          .resume.conformes
                      }
                    </p>

                  </div>

                  <div className="rounded-xl border p-5">

                    <p className="text-sm text-ink-secondary">
                      Non conformes
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-500">
                      {
                        audit.analysis
                          .resume.non_conformes
                      }
                    </p>

                  </div>

                  <div className="rounded-xl border p-5">

                    <p className="text-sm text-ink-secondary">
                      Non applicables
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {
                        audit.analysis
                          .resume.non_applicables
                      }
                    </p>

                  </div>

                </div>

                {/* OBSERVATIONS */}

                <div className="rounded-2xl border border-surface-border bg-surface-card p-6 dark:border-dark-border dark:bg-dark-card">

                  <h2 className="text-lg font-bold">
                    Observations
                  </h2>

                  <div className="mt-4 space-y-3">

                    {audit.analysis.observations
                      ?.length > 0 ? (
                      audit.analysis.observations.map(
                        (
                          observation,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-xl border border-red-500/20 bg-red-500/5 p-4"
                          >

                            <div className="flex gap-3">

                              <span className="font-bold text-red-500">
                                {index + 1}.
                              </span>

                              <p className="text-sm">
                                {observation}
                              </p>

                            </div>

                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-ink-secondary">
                        Aucune observation.
                      </p>
                    )}

                  </div>

                </div>
              </>
            )}
          
          </div>
        )}

        {activeTab === 'capa_plan' && (
  <div className="space-y-6">

    {!capaPlan ? (
      <div className="rounded-2xl border p-6">
        <p className="text-sm text-ink-secondary">
          Aucun plan CAPA disponible pour cet audit.
        </p>
      </div>
    ) : (
      <>
        {/* HEADER CAPA */}

        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 dark:border-dark-border dark:bg-dark-card">

          <div className="flex items-center justify-between">

            <div>
              <p className="font-mono text-sm font-semibold text-primary">
                {capaPlan.capa_id}
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Plan CAPA
              </h2>
            </div>

            <span className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {capaPlan.actions.length} actions
            </span>

          </div>

          {/* RESUME */}

          <div className="mt-6 rounded-xl bg-slate-500/5 p-4">

            <p className="text-sm leading-6">
              {capaPlan.resume}
            </p>

          </div>

        </div>


        {/* ACTIONS CAPA */}

        <div className="space-y-4">

          {capaPlan.actions.map(
            (action, index) => (

              <div
                key={index}
                className="rounded-2xl border border-surface-border bg-surface-card p-6 dark:border-dark-border dark:bg-dark-card"
              >

                {/* TITRE */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold text-primary">
                      Action {index + 1}
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      {action.probleme}
                    </h3>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      action.priorite === 'Critique'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {action.priorite}
                  </span>

                </div>


                {/* CAUSE */}

                <div className="mt-5">

                  <p className="text-xs font-semibold text-ink-secondary">
                    Cause racine
                  </p>

                  <p className="mt-1 text-sm">
                    {action.cause_racine}
                  </p>

                </div>


                {/* ACTION CORRECTIVE */}

                <div className="mt-5">

                  <p className="text-xs font-semibold text-ink-secondary">
                    Action corrective
                  </p>

                  <p className="mt-1 text-sm">
                    {action.action_corrective}
                  </p>

                </div>


                {/* ACTION PREVENTIVE */}

                <div className="mt-5">

                  <p className="text-xs font-semibold text-ink-secondary">
                    Action préventive
                  </p>

                  <p className="mt-1 text-sm">
                    {action.action_preventive}
                  </p>

                </div>


                {/* INFORMATIONS */}

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <div className="rounded-xl bg-slate-500/5 p-3">

                    <p className="text-xs text-ink-secondary">
                      Responsable
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {action.responsable}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-500/5 p-3">

                    <p className="text-xs text-ink-secondary">
                      Échéance
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {action.echeance}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-500/5 p-3">

                    <p className="text-xs text-ink-secondary">
                      Statut
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {action.statut_action}
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </>
    )}

  </div>
)}



      </div>


    </div>
  );
}