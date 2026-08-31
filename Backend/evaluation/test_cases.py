regulatory_cases = [

    # =====================================================
    # QUESTIONS RÉGLEMENTAIRES
    # =====================================================

    {
        "question": "Quelle est l'exigence concernant la chaîne du froid ?",
        "expected_agents": ["regulatory"],
        "expected_tools": ["gdp_research"]
    },

    {
        "question": "Quelles sont les exigences concernant l'étalonnage des instruments de température ?",
        "expected_agents": ["regulatory"],
        "expected_tools": ["gdp_research"]
    },

    {
        "question": "Quelles sont les exigences BPD/GDP concernant le transport des médicaments ?",
        "expected_agents": ["regulatory"],
        "expected_tools": ["gdp_research"]
    },

    {
        "question": "Quelles sont les obligations concernant la traçabilité des transports pharmaceutiques ?",
        "expected_agents": ["regulatory"],
        "expected_tools": ["gdp_research"]
    },

    {
        "question": "Quelles sont les recommandations de l'OMS pour le stockage des produits pharmaceutiques ?",
        "expected_agents": ["regulatory"],
        "expected_tools": ["gdp_research"]
    },
    {
        "question": "Compare les exigences tunisiennes et européennes concernant le transport pharmaceutique.",
        "expected_agents": ["regulatory"],
        "expected_tools": ["gdp_research", "web_search"]
    },


    # =====================================================
    # WEB SEARCH
    # =====================================================

    {
        "question": "Recherche sur le web les dernières exigences européennes GDP concernant le transport des médicaments.",
        "expected_agents": ["regulatory"],
        "expected_tools": ["web_search"]
    },

    {
        "question": "Quelles nouvelles recommandations OMS ont été publiées cette année ?",
        "expected_agents": ["regulatory"],
        "expected_tools": ["web_search"]
    },

    {
        "question": "Résume les 5 actualités réglementaires les plus récentes concernant les GDP.",
        "expected_agents": ["regulatory"],
        "expected_tools": ["web_search"]
    }]

audit_cases = [
    
    {
        "question": "Génère une checklist pour un audit de transport pharmaceutique dans un depot central .",
        "expected_agents": ["regulatory", "audit"],
        "expected_tools": ["gdp_research","get_audit_history"]
    },

    {
        "question": "Génère une checklist pour un audit entrepôt de stockage pharmaceutique dans un site de stockage vaccins.",
        "expected_agents": ["regulatory", "audit"],
        "expected_tools": ["gdp_research","get_audit_history"]
    },
    {
        "question": "Génère une checklist pour un audit fournisseur pharmaceutique dans Fournisseur médicaments.",
        "expected_agents": ["regulatory", "audit"],
        "expected_tools": ["gdp_research","get_audit_history"]
    },


    {
        "question": "Génère une checklist pour contrôler la chaîne du froid des produits pharmaceutiques.",
        "expected_agents": ["regulatory", "audit"],
        "expected_tools": [ "gdp_research"]
    },
    {
        "question": "Génère une checklist pour un audit de gestion des retours produits.",
        "expected_agents": ["regulatory", "audit"],
        "expected_tools": ["gdp_research"]
    },

    {
        "question": "Analyser checklist CHK-003.",
        "expected_agents": ["audit"],
        "expected_tools": ["analyze_checklist"]
    },

    {
            "question": "Analyser checklist CHK-004.",
            "expected_agents": ["audit"],
            "expected_tools": ["analyze_checklist"]
    },

]

capa_cases = [
    {
        "question": "Génère un plan CAPA pour la checklist CHK-003",
        "expected_agents": ["regulatory","capa"],
        "expected_tools": ['get_nonconformities', 'gdp_research']
    },

    {
            "question": "Génère un plan CAPA pour la checklist CHK-004 ",
            "expected_agents": ["regulatory","capa"],
            "expected_tools": ['get_nonconformities', 'gdp_research']
    },
    {
        "question": "Un écart de température a été détecté et l'intervention n'a pas été réalisée dans le délai prévu. Quelle CAPA faut-il mettre en place ?",
        "expected_agents": ["regulatory","capa"],
        "expected_tools": ['gdp_research']
    },
    {
            "question": "Plusieurs produits retournés ont été retrouvés dans la zone de stockage des produits conformes sans identification claire de leur statut. Quelle CAPA faut-il mettre en place ?",
            "expected_agents": ["regulatory","capa"],
            "expected_tools": ['gdp_research']
        },

    {
    "question": "Un écart de température se répète depuis plusieurs semaines malgré les interventions du personnel. Quel plan CAPA faut-il établir ?",
    "expected_agents": ["regulatory", "capa"],
    "expected_tools": ["gdp_research"]
    }
]

report_cases = [

    {
        "question": "Génère un rapport audit pour la checklist CHK-001",
        "expected_agents": ["report"],
        "expected_tools": ['get_report_data', 'get_nonconformities']

    },

    {
        "question": "Génère un rapport audit pour la checklist CHK-002",
        "expected_agents": ["report"],
        "expected_tools": ['get_report_data', 'get_nonconformities']

    }
]

