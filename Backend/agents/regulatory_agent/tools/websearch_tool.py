from duckduckgo_search import DDGS
from langchain_core.tools import tool

def web_search(query, domains):

    results = []

    with DDGS() as ddgs:
        for r in ddgs.text(
            query,
            max_results=5
        ):
            url = r["href"]

            # filtrer les domaines autorisés
            if any(domain in url for domain in domains):
                results.append({
                    "title": r["title"],
                    "url": url,
                    "content": r["body"]
                })

    return results




@tool
def regulatory_watch(query: str):
    """
    Rechercher les dernières mises à jour réglementaires pharmaceutiques.
    Sources :
    EMA, FDA, OMS, ANSM
    Toujours rechercher des documents réglementaires spécifiques,
    pas uniquement les pages d'accueil.
    """

    return web_search(
        query,
        domains=[
            "ema.europa.eu",
            "fda.gov",
            "who.int",
            "ansm.sante.fr"
        ]
    )