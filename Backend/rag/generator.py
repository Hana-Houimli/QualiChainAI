from langchain_ollama import ChatOllama


class Generator:
    def __init__(self, model_name, temperature, max_new_tokens):
        self.llm = ChatOllama(
            model=model_name,
            temperature=temperature,
            num_predict=max_new_tokens,
        )

    def generate(self, prompt):
        response = self.llm.invoke(prompt)
        return response.content