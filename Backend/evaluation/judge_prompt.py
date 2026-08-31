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


### QUALITÉ DE LA RÉPONSE

Évalue de 1 à 5 :

- pertinence
- exactitude
- complétude
- cohérence réglementaire
- conformite_pharmaceutique
- fidélité aux résultats des outils
- absence d'hallucination

Une information réglementaire présente dans la réponse
mais absente des résultats des outils doit être considérée
comme potentiellement hallucinée, sauf si elle découle
clairement des informations fournies.

Vérifie également que la réponse et les actions proposées
respectent les exigences et les règles pharmaceutiques applicables
présentes dans les résultats des outils.


### WORKFLOW

Évalue de 1 à 5 :

- agents_correct
- tools_correct

### SCORE GLOBAL

Le `score_global` doit obligatoirement être compris entre 1 et 5.

### FORMAT

Retourne uniquement un JSON valide :

{{
    "response_quality": {{
        "pertinence": 0,
        "exactitude": 0,
        "completude": 0,
        "coherence_reglementaire": 0,
        "conformite_pharmaceutique": 0,
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