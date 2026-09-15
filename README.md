# QualiChain AI

## Overview 
The system assists pharmaceutical distributors and quality teams by providing regulatory information,
conducting audits, managing CAPA (Corrective and Preventive Actions) processes, and generating audit reports.

The platform leverages Large Language Models (LLMs), Retrieval-Augmented Generation (RAG),
and agent-based orchestration to provide accurate, context-aware assistance based on pharmaceutical regulations.

## Key features
### Regulatory AI Agent
- Providing informations related to pharmaceutical regulations and GDP (Good Distribution Practices).
- Uses RAG to retrieve information from regulatory documents.

### Audit AI Agent
- Generates audit checklists.
- Analyzes completed audits .

 ### CAPA AI Agent
- Creates Corrective and Preventive Action (CAPA) plans to address non-conformities identified during audits or quality-related issues reported by users.

### Reporting AI Agent

- Generates audit reports based on detected non-conformities and the associated Corrective and Preventive Actions (CAPAs).

## Multi-Agent Orchestration
<img width="421" height="432" alt="Multi_Agent_Architecture" src="https://github.com/user-attachments/assets/6b52f193-018c-45c3-854d-0b5bdc75fe46" />

- A supervisor agent routes user requests to the appropriate specialized agent.
- The Regulatory Agent can directly respond to user regulatory queries or provide regulatory context to the Audit and CAPA agents when needed.

## Installation
#### Backend Setup
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

#### Frontend Setup
npm install 
npm run dev





