from langchain.agents import create_agent


class RegulatoryAgent:


    def __init__(
        self,
        model,
        tools,
        system_prompt
    ):

        self.agent = create_agent(
            model=model,
            tools=tools,
            system_prompt=system_prompt
        )


    def run(self, question):

        response = self.agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": question
                    }
                ]
            }
        )

        return response