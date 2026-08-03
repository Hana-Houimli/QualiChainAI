import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AuditsList from './pages/audits/AuditsList';
import DocumentsPage from './pages/documents/DocumentsPage';
import CapaBoard from './pages/capa/CapaBoard';
import RisksPage from './pages/risks/RisksPage';
import IotMonitoringPage from './pages/iot/IotMonitoringPage';
import ReportsPage from './pages/reports/ReportsPage';
import TrainingPage from './pages/training/TrainingPage';
import AdminPage from './pages/admin/AdminPage';
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
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/capa" element={<CapaBoard />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/iot-monitoring" element={<IotMonitoringPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/administration" element={<AdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
