from langchain_ollama import ChatOllama
llm = ChatOllama(
            model="qwen3:8b",
            base_url="https://happening-colt-delouse.ngrok-free.dev",
            temperature=0,
            num_predict=8192,
            think=False
    )