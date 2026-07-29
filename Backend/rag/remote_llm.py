import requests


class RemoteLLM:

    def __init__(self, url):
        self.url = url


    def invoke(self, prompt):

        response = requests.post(
            self.url,
            json={
                "prompt": prompt
            }
        )

        response.raise_for_status()

        return response.json()["response"]