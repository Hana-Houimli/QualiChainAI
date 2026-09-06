import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AuditsList from './pages/audits/AuditsList';
import AuditDetails from './pages/audits/AuditDetails';
import CapaBoard from './pages/capa/CapaBoard';

import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import AiAssistantPage from './pages/ai-assistant/AiAssistantPage';


const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AiAssistantPage />} />
            <Route path="/audits" element={<AuditsList />} />
            <Route path="/audits/:id" element={<AuditDetails />} />

            <Route path="/capa" element={<CapaBoard />} />

            <Route path="/reports" element={<ReportsPage />} />

            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
