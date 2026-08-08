from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from prompts import audit_prompt
from tools import get_audit_history


llm = ChatOllama(
            model="qwen3:8b",
            base_url="https://happening-colt-delouse.ngrok-free.dev",
            temperature=0,
            num_predict=4096,
            think=False
    )

audit_agent = create_agent(
    model=llm,
    tools=[get_audit_history],
    system_prompt=audit_prompt
)