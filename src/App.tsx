import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MobileWork from './pages/MobileWork';
import HarvestManagement from './pages/HarvestManagement';
import HouseCarte from './pages/HouseCarte';
import Productivity from './pages/Productivity';
import WorkPlan from './pages/WorkPlan';
import Quality from './pages/Quality';
import PesticideHistory from './pages/PesticideHistory';
import Inventory from './pages/Inventory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="mobile" element={<MobileWork />} />
          <Route path="harvest" element={<HarvestManagement />} />
          <Route path="house-carte" element={<HouseCarte />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="work-plan" element={<WorkPlan />} />
          <Route path="quality" element={<Quality />} />
          <Route path="pesticide" element={<PesticideHistory />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
