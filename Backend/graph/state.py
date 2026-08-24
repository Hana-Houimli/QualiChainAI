from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage
from operator import add


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add]

    next_agent: str

    task_type: str

    regulatory_context: str | None

    non_conformities: list | None