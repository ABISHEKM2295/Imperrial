import { useState, useEffect } from 'react';
import { getFabricQualityAnalytics } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AnalyticsPage.css';

const FabricQuality = () => {
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
            const response = await getFabricQualityAnalytics(dateRange);
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching fabric quality data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const overall = data?.overall || {};
    const dailyTrends = data?.daily_trends || [];

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Fabric Quality Analysis</h1>
                    <p className="page-subtitle">Monitor fabric efficiency and rejection rates</p>
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
                    <h4>Total Input</h4>
                    <p className="metric-value">{(overall.total_input || 0).toLocaleString()} kg</p>
                </div>
                <div className="metric-card">
                    <h4>Total Output</h4>
                    <p className="metric-value">{(overall.total_output || 0).toLocaleString()} kg</p>
                </div>
                <div className="metric-card">
                    <h4>Avg Efficiency</h4>
                    <p className="metric-value">{(overall.avg_efficiency || 0).toFixed(2)}%</p>
                </div>
                <div className="metric-card">
                    <h4>Avg Rejection Rate</h4>
                    <p className="metric-value">{(overall.avg_rejection_rate || 0).toFixed(2)}%</p>
                </div>
            </div>

            <div className="charts-grid">
                {/* Efficiency Trends */}
                <div className="chart-card full-width">
                    <h3 className="chart-title">Daily Efficiency Trends</h3>
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
                                dataKey="efficiency_pct"
                                stroke="#48bb78"
                                strokeWidth={3}
                                name="Efficiency %"
                                dot={{ fill: '#48bb78', r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rejection_pct"
                                stroke="#f56565"
                                strokeWidth={3}
                                name="Rejection %"
                                dot={{ fill: '#f56565', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Production Volume */}
                <div className="chart-card full-width">
                    <h3 className="chart-title">Daily Production Volume</h3>
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
                                dataKey="total_input"
                                stroke="#667eea"
                                strokeWidth={3}
                                name="Input (kg)"
                            />
                            <Line
                                type="monotone"
                                dataKey="total_output"
                                stroke="#48bb78"
                                strokeWidth={3}
                                name="Output (kg)"
                            />
                            <Line
                                type="monotone"
                                dataKey="total_rejection"
                                stroke="#f56565"
                                strokeWidth={3}
                                name="Rejection (kg)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FabricQuality;
