import React from 'react';
import { Shield, Clock, FileWarning, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Stat Cards */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open Incidents</p>
                            <h1 style={{ margin: '0.5rem 0 0 0' }}>24</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                            <FileWarning size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escalated</p>
                            <h1 style={{ margin: '0.5rem 0 0 0', color: 'var(--accent-danger)' }}>3</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(255, 42, 95, 0.1)', borderRadius: '8px', color: 'var(--accent-danger)' }}>
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Under Review</p>
                            <h1 style={{ margin: '0.5rem 0 0 0', color: 'var(--accent-warning)' }}>12</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(255, 179, 0, 0.1)', borderRadius: '8px', color: 'var(--accent-warning)' }}>
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Score</p>
                            <h1 style={{ margin: '0.5rem 0 0 0', color: 'var(--accent-success)' }}>98%</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '8px', color: 'var(--accent-success)' }}>
                            <Shield size={24} />
                        </div>
                    </div>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', height: '400px' }}>
                    <h3>Incident Volume (Last 7 Days)</h3>
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        [Chart Placeholder]
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Recent Activity</h3>
                    <ul style={{ listStyle: 'none', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Inc-2026-042</strong> reported by J. Smith</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 minutes ago</span>
                        </li>
                        <li style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Inc-2026-041</strong> escalated to Under Review</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 hour ago</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
