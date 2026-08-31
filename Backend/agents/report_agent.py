from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from prompts import report_prompt
from tools import get_report_data , get_nonconformities


llm = ChatOllama(
            model="qwen3:8b",
            base_url="https://happening-colt-delouse.ngrok-free.dev",
            temperature=0,
            num_predict=4096,
            think=False
    )

report_agent = create_agent(
    model=llm,
    tools=[get_report_data, get_nonconformities],
    system_prompt=report_prompt
)