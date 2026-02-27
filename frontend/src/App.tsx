import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import IncidentList from './pages/IncidentList';
import NewIncident from './pages/NewIncident';
import EditIncident from './pages/EditIncident';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="incidents" element={<IncidentList />} />
          <Route path="incidents/new" element={<NewIncident />} />
          <Route path="incidents/edit/:id" element={<EditIncident />} />

          {/* Placeholder valid routes */}
          <Route path="personnel" element={<div style={{ padding: '2rem' }}><h2>Personnel Directory (Coming Soon)</h2></div>} />
          <Route path="reports" element={<div style={{ padding: '2rem' }}><h2>Advanced Reporting (Coming Soon)</h2></div>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
