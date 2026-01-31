import { NavLink } from 'react-router-dom';
import { Home, Flame, Droplets, Package, Settings, Plus } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Imperrial Analytics</h1>
                    <p className="logo-subtitle">Textile Manufacturing</p>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Home size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/steam-efficiency" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Flame size={20} />
                        <span>Steam Efficiency</span>
                    </NavLink>

                    <NavLink to="/water-management" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Droplets size={20} />
                        <span>Water Management</span>
                    </NavLink>

                    <NavLink to="/fabric-quality" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Package size={20} />
                        <span>Fabric Quality</span>
                    </NavLink>

                    <NavLink to="/machine-performance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Settings size={20} />
                        <span>Machine Performance</span>
                    </NavLink>

                    <NavLink to="/data-entry" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Plus size={20} />
                        <span>Data Entry</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <p>© 2026 Imperrial Group</p>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
