from langgraph.graph import StateGraph, END

from graph.state import AgentState
from graph.nodes import (
    audit_node,
    regulatory_node
)
from graph.supervisor import supervisor_node


graph = StateGraph(AgentState)


# Nodes
graph.add_node("supervisor", supervisor_node)
graph.add_node("regulatory", regulatory_node)
graph.add_node("audit", audit_node)


# Start
graph.set_entry_point("supervisor")


# Supervisor → Regulatory
def supervisor_router(state):
    return state["next_agent"]


graph.add_conditional_edges(
    "supervisor",
    supervisor_router,
    {
        "regulatory": "regulatory"
    }
)


# Regulatory → Audit or END
def regulatory_router(state):

    if state["task_type"] == "audit_checklist":
        return "audit"

    return "end"


graph.add_conditional_edges(
    "regulatory",
    regulatory_router,
    {
        "audit": "audit",
        "end": END
    }
)


# Audit → END
graph.add_edge("audit", END)


app = graph.compile()