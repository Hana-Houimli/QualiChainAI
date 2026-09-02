JUDGE_PROMPT = """
Tu es un LLM Judge chargé d'évaluer un système multi-agent
pharmaceutique et réglementaire.

Évalue :

1. LA QUALITÉ DE LA RÉPONSE
2. LE WORKFLOW MULTI-AGENT

QUESTION :
{question}

AGENTS ATTENDUS :
{expected_agents}

AGENTS UTILISÉS :
{agents_used}

OUTILS ATTENDUS :
{expected_tools}

OUTILS UTILISÉS :
{tools_used}

RÉSULTATS DES OUTILS :
{tool_outputs}

RÉPONSE FINALE :
{final_answer}


## CRITÈRES D'ÉVALUATION

Évalue CHAQUE critère 0 à 3 : 

0 = Absent
1 = Faible
2 = Acceptable
3 = Bon

### QUALITÉ DE LA RÉPONSE

- pertinence : répond-elle à la question posée ?
- exactitude : les infos sont-elles correctes et sans erreur ?
- complétude : tous les aspects demandés sont-ils couverts ?
- coherence_reglementaire : suit-elle les règles réglementaires applicables ?
- fidelite_aux_outils : s'appuie-t-elle sur les résultats des outils fournis ?
- absence d'hallucination : contient-elle des infos inventées (absentes des tool_outputs)?

Une information réglementaire présente dans la réponse
mais absente des résultats des outils doit être considérée
comme potentiellement hallucinée, sauf si elle découle
clairement des informations fournies.


### WORKFLOW

- agents_correct : les bons agents ont-ils été utilisés ?
- tools_correct : les bons outils ont-ils été utilisés ?

### SCORE GLOBAL

Le `score_global` moyenne de tous les critères.

### FORMAT

Retourne uniquement un JSON valide :

{{
    "response_quality": {{
        "pertinence": 0,
        "exactitude": 0,
        "completude": 0,
        "coherence_reglementaire": 0,
        "fidelite_aux_outils": 0,
        "absence_hallucination": 0,

    }},

    "workflow_quality": {{
        "agents_correct": 0,
        "tools_correct": 0
    }},

    "score_global": 0,
    "justification": ""
}}
"""