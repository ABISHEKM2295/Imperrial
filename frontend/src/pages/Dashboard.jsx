import { useState, useEffect } from 'react';
import { getDashboardOverview } from '../services/api';
import KPICard from '../components/KPICard';
import { Activity, Droplets, Package, Settings, TrendingUp, Download, RefreshCw, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToExcel, exportToPDF, formatNumber } from '../utils/exportUtils';
import './Dashboard.css';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            const response = await getDashboardOverview();
            setData(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data. Please ensure the backend server is running.');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleExportExcel = () => {
        if (!data) return;

        const exportData = [
            { Metric: "Today's Production", Value: `${todayProduction.total_fabric_kg || 0} kg` },
            { Metric: "Steam Used", Value: `${todayProduction.total_steam_kg || 0} kg` },
            { Metric: "Batches Completed", Value: todayProduction.batch_count || 0 },
            { Metric: "Fresh Water Used", Value: `${todayWater.total_fresh_water || 0} L` },
            { Metric: "Recycled Water", Value: `${todayWater.total_recycled_water || 0} L` },
            { Metric: "Recycling Rate", Value: `${recyclingPct}%` },
            { Metric: "Running Machines", Value: runningMachines },
            { Metric: "Idle Machines", Value: idleMachines },
            { Metric: "Breakdown Machines", Value: breakdownMachines },
            { Metric: "Average Efficiency", Value: `${(monthEfficiency.avg_efficiency || 0).toFixed(1)}%` }
        ];

        exportToExcel(exportData, `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`, 'Dashboard');
    };

    const handleExportPDF = () => {
        if (!data) return;

        const exportData = [
            { Metric: "Today's Production", Value: `${todayProduction.total_fabric_kg || 0} kg` },
            { Metric: "Steam Used", Value: `${todayProduction.total_steam_kg || 0} kg` },
            { Metric: "Batches Completed", Value: todayProduction.batch_count || 0 },
            { Metric: "Fresh Water Used", Value: `${todayWater.total_fresh_water || 0} L` },
            { Metric: "Recycled Water", Value: `${todayWater.total_recycled_water || 0} L` },
            { Metric: "Recycling Rate", Value: `${recyclingPct}%` },
            { Metric: "Running Machines", Value: runningMachines },
            { Metric: "Idle Machines", Value: idleMachines },
            { Metric: "Breakdown Machines", Value: breakdownMachines },
            { Metric: "Average Efficiency", Value: `${(monthEfficiency.avg_efficiency || 0).toFixed(1)}%` }
        ];

        exportToPDF(exportData, ['Metric', 'Value'], 'Imperrial Analytics - Dashboard Report', `Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="error-container">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchDashboardData} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const machineStats = data?.machines || [];
    const todayProduction = data?.today_production || {};
    const todayWater = data?.today_water || {};
    const monthEfficiency = data?.month_efficiency || {};

    const runningMachines = machineStats.find(m => m._id === 'Running')?.count || 0;
    const idleMachines = machineStats.find(m => m._id === 'Idle')?.count || 0;
    const breakdownMachines = machineStats.find(m => m._id === 'Breakdown')?.count || 0;
    const totalMachines = runningMachines + idleMachines + breakdownMachines;

    const totalWater = (todayWater.total_fresh_water || 0) + (todayWater.total_recycled_water || 0);
    const recyclingPct = totalWater > 0
        ? ((todayWater.total_recycled_water / totalWater) * 100).toFixed(1)
        : 0;

    return (
        <div className="dashboard">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Real-time analytics for textile manufacturing operations</p>
                </div>
                <div className="header-actions">
                    <button onClick={handleExportExcel} className="export-btn excel" title="Export to Excel">
                        <FileSpreadsheet size={18} />
                        Excel
                    </button>
                    <button onClick={handleExportPDF} className="export-btn pdf" title="Export to PDF">
                        <FileText size={18} />
                        PDF
                    </button>
                    <button
                        onClick={fetchDashboardData}
                        className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
                        disabled={refreshing}
                    >
                        <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Alert for breakdowns */}
            {breakdownMachines > 0 && (
                <div className="alert alert-danger">
                    <span className="alert-icon">⚠️</span>
                    <div className="alert-content">
                        <strong>Machine Breakdown Alert!</strong>
                        <p>{breakdownMachines} machine{breakdownMachines > 1 ? 's are' : ' is'} currently in breakdown status. Immediate attention required.</p>
                    </div>
                </div>
            )}

            {/* KPI Grid */}
            <div className="kpi-grid">
                <KPICard
                    title="Today's Production"
                    value={formatNumber(todayProduction.total_fabric_kg || 0)}
                    unit="kg"
                    icon={Package}
                    color="#667eea"
                    trend={todayProduction.batch_count ? `${todayProduction.batch_count} batches` : null}
                />
                <KPICard
                    title="Active Machines"
                    value={`${runningMachines}/${totalMachines}`}
                    icon={Settings}
                    color="#48bb78"
                    trend={`${idleMachines} idle`}
                />
                <KPICard
                    title="Water Recycling"
                    value={recyclingPct}
                    unit="%"
                    icon={Droplets}
                    color="#4299e1"
                    trend={totalWater > 0 ? `${formatNumber(totalWater)} L total` : null}
                />
                <KPICard
                    title="Avg Efficiency"
                    value={(monthEfficiency.avg_efficiency || 0).toFixed(1)}
                    unit="%"
                    icon={TrendingUp}
                    color="#ed8936"
                    trend="This month"
                />
            </div>

            {/* Machine Status */}
            <div className="dashboard-section">
                <h2 className="section-title">Machine Status</h2>
                <div className="machine-status-grid">
                    <div className="status-card running">
                        <div className="status-icon">✓</div>
                        <div className="status-info">
                            <h3>{runningMachines}</h3>
                            <p>Running</p>
                        </div>
                        <div className="status-percentage">
                            {totalMachines > 0 ? Math.round((runningMachines / totalMachines) * 100) : 0}%
                        </div>
                    </div>
                    <div className="status-card idle">
                        <div className="status-icon">⏸</div>
                        <div className="status-info">
                            <h3>{idleMachines}</h3>
                            <p>Idle</p>
                        </div>
                        <div className="status-percentage">
                            {totalMachines > 0 ? Math.round((idleMachines / totalMachines) * 100) : 0}%
                        </div>
                    </div>
                    <div className="status-card breakdown">
                        <div className="status-icon">⚠</div>
                        <div className="status-info">
                            <h3>{breakdownMachines}</h3>
                            <p>Breakdown</p>
                        </div>
                        <div className="status-percentage">
                            {totalMachines > 0 ? Math.round((breakdownMachines / totalMachines) * 100) : 0}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Summary */}
            <div className="dashboard-section">
                <h2 className="section-title">Today's Summary</h2>
                <div className="summary-grid">
                    <div className="summary-card">
                        <h4>Production</h4>
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Fabric Processed</span>
                                <span className="stat-value">{formatNumber(todayProduction.total_fabric_kg || 0)} kg</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Steam Used</span>
                                <span className="stat-value">{formatNumber(todayProduction.total_steam_kg || 0)} kg</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Batches</span>
                                <span className="stat-value">{todayProduction.batch_count || 0}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Avg Steam Efficiency</span>
                                <span className="stat-value">
                                    {todayProduction.total_fabric_kg > 0
                                        ? (todayProduction.total_steam_kg / todayProduction.total_fabric_kg).toFixed(2)
                                        : 0} kg/kg
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card">
                        <h4>Water Usage</h4>
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Fresh Water</span>
                                <span className="stat-value">{formatNumber(todayWater.total_fresh_water || 0)} L</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Recycled Water</span>
                                <span className="stat-value">{formatNumber(todayWater.total_recycled_water || 0)} L</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Recycling Rate</span>
                                <span className="stat-value">{recyclingPct}%</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Total Water</span>
                                <span className="stat-value">{formatNumber(totalWater)} L</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
