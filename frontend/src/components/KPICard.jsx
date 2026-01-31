import './KPICard.css';

const KPICard = ({ title, value, unit, icon: Icon, color, trend }) => {
    return (
        <div className="kpi-card" style={{ '--card-color': color }}>
            <div className="kpi-header">
                <div className="kpi-icon" style={{ background: `${color}15` }}>
                    <Icon size={24} style={{ color }} />
                </div>
                <h3 className="kpi-title">{title}</h3>
            </div>
            <div className="kpi-body">
                <div className="kpi-value-container">
                    <span className="kpi-value">{value}</span>
                    {unit && <span className="kpi-unit">{unit}</span>}
                </div>
                {trend && (
                    <div className="kpi-trend">
                        <span className="trend-text">{trend}</span>
                    </div>
                )}
            </div>
            <div className="kpi-glow"></div>
        </div>
    );
};

export default KPICard;
