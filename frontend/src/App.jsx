import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SteamEfficiency from './pages/SteamEfficiency';
import WaterManagement from './pages/WaterManagement';
import FabricQuality from './pages/FabricQuality';
import MachinePerformance from './pages/MachinePerformance';
import DataEntry from './pages/DataEntry';
import './App.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/steam-efficiency" element={<SteamEfficiency />} />
                    <Route path="/water-management" element={<WaterManagement />} />
                    <Route path="/fabric-quality" element={<FabricQuality />} />
                    <Route path="/machine-performance" element={<MachinePerformance />} />
                    <Route path="/data-entry" element={<DataEntry />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
