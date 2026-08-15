from langchain_ollama import ChatOllama


llm = ChatOllama(
    model="qwen3:8b",
    base_url="https://happening-colt-delouse.ngrok-free.dev",
    temperature=0,
    think=False
)


def supervisor_node(state):

    question = state["messages"][0].content


    prompt = f"""
Tu es le Supervisor Agent de QualiChain AI.

Choisis une seule catégorie :

AUDIT_CHECKLIST
- générer checklist
- créer checklist
- préparer audit

AUDIT_ANALYSIS
- analyser checklist
- analyser audit
- score conformité
- non conformités

AUDIT_REPORT
- rapport audit
- générer rapport
- rapport conformité

REGULATORY
- GDP
- BPD
- SOP
- EMA
- WHO
- réglementation


Question :
{question}

Répond uniquement :
AUDIT_CHECKLIST
ou
REGULATORY
""" 


    result = llm.invoke(prompt)

    decision = result.content.strip().upper()

    if decision == "AUDIT_CHECKLIST":
        return {
            "next_agent": "regulatory",
            "task_type": "audit_checklist"
        }

    elif decision == "AUDIT_ANALYSIS":
        return {
            "next_agent": "audit",
            "task_type": "audit_analysis"
        }

    elif decision == "AUDIT_REPORT":
        return {
            "next_agent": "report",
            "task_type": "audit_report"
        }

    return {
        "next_agent": "regulatory",
        "task_type": "regulatory_question"
    }