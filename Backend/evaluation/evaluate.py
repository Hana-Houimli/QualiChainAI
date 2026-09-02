from judge_prompt import JUDGE_PROMPT
from langchain_core.messages import HumanMessage
import json

from langchain_ollama import ChatOllama
judge_llm = ChatOllama(
    model="qwen3:8b",
    base_url="https://happening-colt-delouse.ngrok-free.dev",
    temperature=0,
    format="json"
)


def evaluate(test_case, result):
    judge_input = JUDGE_PROMPT.format(
        question=test_case["question"],
        expected_agents=test_case["expected_agents"],
        agents_used=result["agents_used"],
        expected_tools=test_case["expected_tools"],
        tools_used=result["tools_used"],
        tool_outputs=result["tool_outputs"],
        final_answer=result["messages"][-1].content
    )

    response = judge_llm.invoke([
        HumanMessage(content=judge_input)
    ])

    return json.loads(response.content)