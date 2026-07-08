from langchain_core.prompts import ChatPromptTemplate

chat_prompt = ChatPromptTemplate.from_messages([(
        "system","""You are an AI assistant specialized in Good Distribution Practices (GDP)
                    and pharmaceutical regulatory compliance.
                    Use ONLY the provided context to answer the question.

                Rules:
        - Do not invent information.
        """
    ),
    (
        "human",
        """
        Context:{context}
        Question:{question}
        """
    )])

def build_prompt(question, context):

    return chat_prompt.invoke({
        "context": context,
        "question": question
    })
