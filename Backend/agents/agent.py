from langchain.agents import create_agent
from langchain_ollama import ChatOllama

class Agent:


    def __init__(self,name,tools,system_prompt):

        self.name = name
        self.llm = ChatOllama(
            model="qwen3:8b",
            base_url="https://happening-colt-delouse.ngrok-free.dev",
            temperature=0,
            num_predict=8192,
            think=False
    )


        self.agent = create_agent(
            model=self.llm,
            tools=tools,
            system_prompt=system_prompt
        )


    def run(self, messages:list):

        response = self.agent.invoke(
            {
                "messages": messages
            }
        )

        return response