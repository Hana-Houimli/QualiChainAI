
from agents import regulatory_agent , audit_agent , report_agent, capa_agent
from langchain_core.messages import HumanMessage
from utils.extract_tool_info import extract_tool_trace

import json


def regulatory_node(state):

    response = regulatory_agent.invoke(
        {
            "messages": state["messages"]
        }
    )

    regulatory_answer = response["messages"][-1]

    tools_used, tool_outputs = extract_tool_trace(response)

    # ==========================================
    # QUESTION RÉGLEMENTAIRE
    # ==========================================

    if state["task_type"] == "regulatory_question":

        return {
            "messages": [
                regulatory_answer
            ],
            "agents_used": ["regulatory"],

            "tools_used": tools_used,

            "tool_outputs": tool_outputs
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

            "non_conformities": data["non_conformities"],

            "agents_used": ["regulatory"],

            "tools_used": tools_used,

            "tool_outputs": tool_outputs
        }

    # ==========================================
    # AUDIT CHECKLIST
    # ==========================================

    else:

        return {
            "regulatory_context": regulatory_answer.content,

            "agents_used": ["regulatory"],

            "tools_used": tools_used,

            "tool_outputs": tool_outputs
        }

def audit_node(state):

    # Analyse d'une checklist existante
    if state["task_type"] == "audit_analysis":

        response = audit_agent.invoke(
            {
                "messages": state["messages"]
            }
        )


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

    tools_used, tool_outputs = extract_tool_trace(response)

    return {
    "messages": [
        response["messages"][-1]
    ],

    "agents_used": ["audit"],

    "tools_used": tools_used,

    "tool_outputs": tool_outputs
}

def report_node(state):

    response = report_agent.invoke(
        {
            "messages": state["messages"]
        }
    )
    tools_used, tool_outputs = extract_tool_trace(response)

    return {
        "messages": [
            response["messages"][-1]
        ],

        "agents_used": ["report"],

        "tools_used": tools_used,

        "tool_outputs": tool_outputs

    }

def capa_node(state):

    if state.get("non_conformities", []) == []:
        response = capa_agent.invoke(
        {
            "messages": [
                HumanMessage(
                    content=f"""
Voici Demande de l'utilisateur :
{state["messages"][0].content}


Voici les exigences réglementaires applicables :
{state.get("regulatory_context", "")}

Génère le plan CAPA conformément aux exigences
réglementaires fournies.
"""
                )
            ]
        }
    )
    else: 
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
    tools_used, tool_outputs = extract_tool_trace(response)

    return {
    "messages": [
        response["messages"][-1]
    ],

    "agents_used": ["capa"],

    "tools_used": tools_used,

    "tool_outputs": tool_outputs
}