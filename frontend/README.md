# QualiChain AI — Frontend

Plateforme SaaS de gestion de la qualité pharmaceutique (GDP/BPD), développée pour PharmaLink.

## Stack
React 19 · TypeScript · Vite · Tailwind CSS · React Router · TanStack Query · Zustand · React Hook Form · Framer Motion · Recharts · Lucide Icons

## Démarrage

```bash
npm install
npm run dev
```

L'application démarre sur http://localhost:5173

## Build de production

```bash
npm run build
npm run preview
```

## Architecture

```
src/
  components/
    ui/          → Button, Card, Badge, Icon (primitives)
    layout/       → Sidebar, Header, AppLayout, MobileNav
    dashboard/    → KPI cards, charts, compliance score, risk heat map
    shared/       → PageHeader, DataTable, Skeleton/Empty/Error states
  pages/           → Une page par module (audits, capa, risks, documents, iot, reports, training, admin, settings, ai-assistant)
  services/        → mockData.ts (données fictives réalistes, à remplacer par des appels API)
  store/           → useUiStore (thème clair/sombre, sidebar)
  types/           → Types partagés (AuditItem, CapaItem, RiskItem, etc.)
  routes/          → navConfig.ts (structure de navigation)
```

## Intégration backend

Toutes les données proviennent actuellement de `src/services/mockData.ts`. Pour brancher une vraie API :
1. Créer des hooks React Query dans `src/hooks/` (ex. `useAudits.ts`) qui appellent votre client HTTP dans `src/services/`.
2. Remplacer les imports de `mockData` dans les pages par ces hooks.
3. Les types dans `src/types/index.ts` sont déjà prêts à représenter les payloads API.

## Thème

Le thème clair/sombre est piloté par `useUiStore` (Zustand) et persisté dans `localStorage`. Toutes les couleurs sont définies comme tokens Tailwind dans `tailwind.config.js`.
