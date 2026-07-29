

class RAGPipeline:
    def __init__(self,vectordb, generator, prompt):
        self.vector_db = vectordb
        self.generator = generator
        self.prompt = prompt

    
    

    def answer(self,k, question):
        retrieved_docs = self.vector_db.retrieve(question,k)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        augmented_prompt = self.prompt.invoke({
                "context": context,
                "question": question
            })

        answer = self.generator.generate(
            augmented_prompt.to_string()
        )



        return {
            "answer": answer,
        }

