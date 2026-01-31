import { useState, useEffect } from 'react';
import { getWaterManagementAnalytics } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AnalyticsPage.css';

const WaterManagement = () => {
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
            const response = await getWaterManagementAnalytics(dateRange);
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching water management data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const overall = data?.overall || {};
    const dailyTrends = data?.daily_trends || [];
    const byMachine = data?.by_machine || [];
    const byShift = data?.by_shift || [];

    const waterBreakdown = [
        { name: 'Fresh Water', value: overall.total_fresh_water || 0, color: '#4299e1' },
        { name: 'Recycled Water', value: overall.total_recycled_water || 0, color: '#48bb78' }
    ];

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Water Management</h1>
                    <p className="page-subtitle">Track water usage and recycling efficiency</p>
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

            {/* Key Metrics */}
            <div className="metrics-row">
                <div className="metric-card">
                    <h4>Total Water Used</h4>
                    <p className="metric-value">{(overall.total_water || 0).toLocaleString()} L</p>
                </div>
                <div className="metric-card">
                    <h4>Recycling Rate</h4>
                    <p className="metric-value">{(overall.recycling_percentage || 0).toFixed(1)}%</p>
                </div>
                <div className="metric-card">
                    <h4>Water per kg Fabric</h4>
                    <p className="metric-value">{(overall.water_per_kg || 0).toFixed(2)} L/kg</p>
                </div>
            </div>

            <div className="charts-grid">
                {/* Water Breakdown Pie Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Water Source Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={waterBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {waterBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Daily Trends */}
                <div className="chart-card">
                    <h3 className="chart-title">Daily Water Usage Trends</h3>
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
                                dataKey="fresh_water"
                                stroke="#4299e1"
                                strokeWidth={3}
                                name="Fresh Water (L)"
                            />
                            <Line
                                type="monotone"
                                dataKey="recycled_water"
                                stroke="#48bb78"
                                strokeWidth={3}
                                name="Recycled Water (L)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Machine Comparison */}
                <div className="chart-card full-width">
                    <h3 className="chart-title">Water Consumption by Machine</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byMachine}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="_id" stroke="#718096" />
                            <YAxis stroke="#718096" />
                            <Tooltip
                                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar dataKey="total_fresh" fill="#4299e1" name="Fresh Water (L)" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="total_recycled" fill="#48bb78" name="Recycled Water (L)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default WaterManagement;
