import { useState, useEffect } from 'react';
import { getSteamEfficiencyAnalytics } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import './AnalyticsPage.css';

const SteamEfficiency = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getSteamEfficiencyAnalytics(dateRange);
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching steam efficiency data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const dailyTrends = data?.daily_trends || [];
    const byMachine = data?.by_machine || [];
    const byShift = data?.by_shift || [];

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Steam Efficiency Analysis</h1>
                    <p className="page-subtitle">Monitor steam consumption and optimize usage</p>
                </div>
                <div className="date-filters">
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="date-input"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="date-input"
                    />
                </div>
            </div>

            <div className="charts-grid">
                {/* Daily Trends */}
                <div className="chart-card full-width">
                    <h3 className="chart-title">Daily Steam Usage Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="_id" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip
                                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="total_steam"
                                stroke="#667eea"
                                strokeWidth={3}
                                name="Total Steam (kg)"
                                dot={{ fill: '#667eea', r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total_fabric"
                                stroke="#48bb78"
                                strokeWidth={3}
                                name="Total Fabric (kg)"
                                dot={{ fill: '#48bb78', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Machine Comparison */}
                <div className="chart-card">
                    <h3 className="chart-title">Steam Efficiency by Machine</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byMachine}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="_id" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip
                                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar
                                dataKey="avg_steam_per_kg"
                                fill="#667eea"
                                name="Avg Steam per kg Fabric"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Shift Comparison */}
                <div className="chart-card">
                    <h3 className="chart-title">Performance by Shift</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byShift}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="_id" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip
                                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar
                                dataKey="total_fabric"
                                fill="#48bb78"
                                name="Total Fabric (kg)"
                                radius={[8, 8, 0, 0]}
                            />
                            <Bar
                                dataKey="batch_count"
                                fill="#4299e1"
                                name="Batch Count"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Machine Performance Table */}
            <div className="data-table-card">
                <h3 className="chart-title">Machine Performance Details</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Machine ID</th>
                                <th>Avg Steam/kg</th>
                                <th>Total Fabric (kg)</th>
                                <th>Total Steam (kg)</th>
                                <th>Batches</th>
                            </tr>
                        </thead>
                        <tbody>
                            {byMachine.map((machine) => (
                                <tr key={machine._id}>
                                    <td><strong>{machine._id}</strong></td>
                                    <td>{machine.avg_steam_per_kg?.toFixed(2)}</td>
                                    <td>{machine.total_fabric}</td>
                                    <td>{machine.total_steam}</td>
                                    <td>{machine.batch_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SteamEfficiency;
