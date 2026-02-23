import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    ShieldAlert,
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Search,
    Bell
} from 'lucide-react';
import '../App.css';

const MainLayout: React.FC = () => {
    const location = useLocation();

    // Helper to get breadcrumb name
    const getPageTitle = () => {
        if (location.pathname === '/') return 'Dashboard Overview';
        if (location.pathname.includes('/incidents')) return 'Incident Management';
        if (location.pathname.includes('/reports')) return 'Security Reports';
        return location.pathname.split('/')[1];
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <ShieldAlert className="sidebar-logo-icon" size={32} />
                    <h2 className="sidebar-title">COURTROOM<br /><span style={{ color: 'var(--text-muted)' }}>SECURITY</span></h2>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard className="nav-icon" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/incidents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FileText className="nav-icon" />
                        <span>Incidents</span>
                    </NavLink>

                    <NavLink to="/personnel" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users className="nav-icon" />
                        <span>Personnel</span>
                    </NavLink>

                    <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Settings className="nav-icon" />
                        <span>Reporting</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">SA</div>
                        <div className="user-info">
                            <span className="user-name">System Admin</span>
                            <span className="user-role">Global Access</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-breadcrumbs">
                        SYSTEM // <span style={{ color: 'var(--text-primary)' }}>{getPageTitle().toUpperCase()}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                            <Search size={20} />
                        </button>
                        <button className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}>
                            <Bell size={20} />
                            <span style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'var(--accent-primary)',
                                borderRadius: '50%',
                                boxShadow: 'var(--shadow-glow)'
                            }}></span>
                        </button>
                    </div>
                </header>

                {/* Dynamic Route Content */}
                <section className="content-area">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default MainLayout;
