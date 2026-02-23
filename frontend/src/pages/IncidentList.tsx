import React from 'react';
import { Plus, Filter, Download } from 'lucide-react';

// Mock data to visualize the UI
const MOCK_INCIDENTS = [
    { id: 'INC-2026-084', date: '2026-02-22T09:14:00Z', type: 'Physical Altercation', location: 'Courtroom 3B', status: 'Escalated', reporter: 'Officer Reed' },
    { id: 'INC-2026-083', date: '2026-02-21T14:30:00Z', type: 'Contraband Found', location: 'Main Entrance Checkpoint', status: 'Open', reporter: 'Agent Smith' },
    { id: 'INC-2026-082', date: '2026-02-20T11:00:00Z', type: 'Medical Emergency', location: 'Lobby', status: 'Closed', reporter: 'Lt. Dan' },
    { id: 'INC-2026-081', date: '2026-02-19T16:45:00Z', type: 'Verbal Threat', location: 'Courtroom 1A', status: 'UnderReview', reporter: 'Judge Judy' },
];

const IncidentList: React.FC = () => {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Open': return <span className="badge badge-open">OPEN</span>;
            case 'UnderReview': return <span className="badge badge-review">UNDER REVIEW</span>;
            case 'Escalated': return <span className="badge badge-escalated">ESCALATED</span>;
            case 'Closed': return <span className="badge badge-closed">CLOSED</span>;
            default: return <span className="badge badge-open">{status}</span>;
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Incident Logs</h2>
                    <p style={{ margin: 0 }}>System of record for all courtroom anomalies and security events.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-ghost">
                        <Filter size={18} /> Filters
                    </button>
                    <button className="btn btn-ghost">
                        <Download size={18} /> Export
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={18} /> New Report
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DATE</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TYPE</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LOCATION</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>STATUS</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REPORTER</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_INCIDENTS.map((inc) => (
                            <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{inc.id}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(inc.date).toLocaleString()}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{inc.type}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{inc.location}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>{getStatusBadge(inc.status)}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{inc.reporter}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentList;
