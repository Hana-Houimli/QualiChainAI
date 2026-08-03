from langchain.agents import create_agent
from langchain_ollama import ChatOllama

class Agent:


    def __init__(self,tools,system_prompt):

        self.llm = ChatOllama(
            model="qwen3:8b",
            base_url="https://happening-colt-delouse.ngrok-free.dev",
            temperature=0,
            num_predict=1024,
            think=False
    )


        self.agent = create_agent(
            model=self.llm,
            tools=tools,
            system_prompt=system_prompt
        )


    def run(self, query:str):

        response = self.agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": query
                    }
                ]
            }
        )

        return response