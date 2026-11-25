import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import App from './App.jsx';
import PetsPage from './pages/PetsPage.jsx';
import PlansPage from './pages/PlansPage.jsx';
import PlanDetail from './components/PlanDetail.jsx';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App renders the Dashboard layout (nav + Outlet) */}
        <Route path="/" element={<App />}>
          {/* "/" has no page of its own, so send the user to /pets */}
          <Route index element={<Navigate to="/pets" replace />} />
          <Route path="pets" element={<PetsPage />} />
          <Route path="pets/:petId" element={<PetsPage />} />
          {/* Nested route: PlanDetail renders inside PlansPage's Outlet */}
          <Route path="plans" element={<PlansPage />}>
            <Route path=":id" element={<PlanDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
