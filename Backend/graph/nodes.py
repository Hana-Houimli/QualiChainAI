
from agents import regulatory_agent , audit_agent , report_agent
from langchain_core.messages import HumanMessage

def regulatory_node(state):

    response = regulatory_agent.invoke(
        {
            "messages": state["messages"]
        }
    )

    regulatory_answer = response["messages"][-1]

    # If regulatory is the final destination
    if state["task_type"] == "regulatory_question":

        return {
            "messages": [
                regulatory_answer
            ]
        }

    # If regulatory is only providing context for audit
    elif state["task_type"] == "audit_checklist":

        return {
            "regulatory_context": regulatory_answer.content
        }

    

def audit_node(state):

    # Analyse d'une checklist existante
    if state["task_type"] == "audit_analysis":

        response = audit_agent.invoke(
            {
                "messages": state["messages"]
            }
        )

        return {
            "messages": [
                response["messages"][-1]
            ]
        }

    # Génération d'une nouvelle checklist
    elif state["task_type"] == "audit_checklist":

        response = audit_agent.invoke(
            {
                "messages": [
                    HumanMessage(
                        content=f"""Voici le contexte réglementaire :{state["regulatory_context"]}
                        Demande utilisateur :{state["messages"][0].content}"""
                    )
                ]
            }
        )

        return {
            "messages": [
                response["messages"][-1]
            ]
        }





def report_node(state):

    response = report_agent.invoke(
        {
            "messages": state["messages"]
        }
    )

    return {
        "messages": [
            response["messages"][-1]
        ]
    }