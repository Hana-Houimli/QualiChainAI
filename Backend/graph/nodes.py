
from agents import regulatory_agent , audit_agent , report_agent, capa_agent
from langchain_core.messages import HumanMessage

import json


def regulatory_node(state):

    response = regulatory_agent.invoke(
        {
            "messages": state["messages"]
        }
    )

    regulatory_answer = response["messages"][-1]

    # ==========================================
    # QUESTION RÉGLEMENTAIRE
    # ==========================================

    if state["task_type"] == "regulatory_question":

        return {
            "messages": [
                regulatory_answer
            ]
        }

    # ==========================================
    # CAPA
    # ==========================================

    elif state["task_type"] == "plan_capa":

        data = json.loads(
            regulatory_answer.content
        )

        return {
            "regulatory_context": data["regulatory_context"],
            "non_conformities": data["non_conformities"]
        }

    # ==========================================
    # AUDIT CHECKLIST
    # ==========================================

    else:

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


def capa_node(state):

    response = capa_agent.invoke(
        {
            "messages": [
                HumanMessage(
                    content=f"""
Voici les non-conformités identifiées :

{state["non_conformities"]}


Voici les exigences réglementaires applicables :

{state["regulatory_context"]}


Génère le plan CAPA conformément aux exigences
réglementaires fournies.
"""
                )
            ]
        }
    )

    return {
        "messages": [
            response["messages"][-1]
        ]
    }