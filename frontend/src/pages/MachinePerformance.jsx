import { useState, useEffect } from 'react';
import { getMachines, getMachineUtilization } from '../services/api';
import { Settings, AlertCircle, CheckCircle, Pause } from 'lucide-react';
import './AnalyticsPage.css';

const MachinePerformance = () => {
    const [machines, setMachines] = useState([]);
    const [utilization, setUtilization] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [machinesRes, utilizationRes] = await Promise.all([
                getMachines(),
                getMachineUtilization()
            ]);
            setMachines(machinesRes.data.data);
            setUtilization(utilizationRes.data.data);
        } catch (error) {
            console.error('Error fetching machine data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Running':
                return <CheckCircle className="status-icon running" />;
            case 'Idle':
                return <Pause className="status-icon idle" />;
            case 'Breakdown':
                return <AlertCircle className="status-icon breakdown" />;
            default:
                return <Settings className="status-icon" />;
        }
    };

    const getStatusClass = (status) => {
        return status.toLowerCase();
    };

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Machine Performance</h1>
                    <p className="page-subtitle">Monitor machine status and utilization</p>
                </div>
                <button onClick={fetchData} className="refresh-btn">
                    🔄 Refresh
                </button>
            </div>

            {/* Machine Status Cards */}
            <div className="machine-grid">
                {machines.map((machine) => (
                    <div key={machine.machine_id} className={`machine-card ${getStatusClass(machine.status)}`}>
                        <div className="machine-header">
                            <div className="machine-info">
                                <h3>{machine.machine_id}</h3>
                                <p>{machine.machine_type}</p>
                            </div>
                            {getStatusIcon(machine.status)}
                        </div>
                        <div className="machine-details">
                            <div className="detail-row">
                                <span>Capacity:</span>
                                <strong>{machine.capacity_kg} kg</strong>
                            </div>
                            <div className="detail-row">
                                <span>Status:</span>
                                <strong className={getStatusClass(machine.status)}>{machine.status}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Utilization Table */}
            <div className="data-table-card">
                <h3 className="chart-title">Machine Utilization Details</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Machine ID</th>
                                <th>Type</th>
                                <th>Capacity (kg)</th>
                                <th>Total Batches</th>
                                <th>Total Fabric (kg)</th>
                                <th>Total Hours</th>
                                <th>Avg per Batch</th>
                                <th>Utilization %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {utilization.map((machine) => (
                                <tr key={machine.machine_id}>
                                    <td><strong>{machine.machine_id}</strong></td>
                                    <td>{machine.machine_type}</td>
                                    <td>{machine.capacity_kg}</td>
                                    <td>{machine.total_batches}</td>
                                    <td>{machine.total_fabric}</td>
                                    <td>{machine.total_hours?.toFixed(1)}</td>
                                    <td>{machine.avg_fabric_per_batch}</td>
                                    <td>
                                        <span className={`utilization-badge ${parseFloat(machine.capacity_utilization_pct) > 80 ? 'high' : parseFloat(machine.capacity_utilization_pct) > 50 ? 'medium' : 'low'}`}>
                                            {machine.capacity_utilization_pct}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MachinePerformance;
