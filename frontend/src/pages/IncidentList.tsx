import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download } from 'lucide-react';

interface Incident {
    id: string;
    incidentDate: string;
    type: number; // For now, keeping as raw enum number
    locationWithinCourthouse: string;
    status: number;
    reporterFirstName: string;
    reporterLastName: string;
}

const IncidentList: React.FC = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5184/api/incidents')
            .then(res => res.json())
            .then(data => {
                setIncidents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch incidents:", err);
                setLoading(false);
            });
    }, []);

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0: return <span className="badge badge-open">OPEN</span>;
            case 1: return <span className="badge badge-review">UNDER REVIEW</span>;
            case 2: return <span className="badge badge-escalated">ESCALATED</span>;
            case 3: return <span className="badge badge-closed">CLOSED</span>;
            default: return <span className="badge badge-open">UNKNOWN</span>;
        }
    };

    const getTypeString = (type: number) => {
        switch (type) {
            case 0: return "Physical Altercation";
            case 1: return "Verbal Threat";
            case 2: return "Medical Emergency";
            case 3: return "Contraband Found";
            case 4: return "Other";
            default: return "Unknown";
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
                    <button className="btn btn-primary" onClick={() => navigate('/incidents/new')}>
                        <Plus size={18} /> New Report
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DATE</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TYPE</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LOCATION</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>STATUS</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REPORTER</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Loading remote incidents from database...
                                </td>
                            </tr>
                        )}
                        {!loading && incidents.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No incidents found.
                                </td>
                            </tr>
                        )}
                        {!loading && incidents.map((inc) => (
                            <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{inc.id.substring(0, 8).toUpperCase()}...</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(inc.incidentDate).toLocaleString()}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>{getTypeString(inc.type)}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{inc.locationWithinCourthouse}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>{getStatusBadge(inc.status)}</td>
                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{inc.reporterFirstName} {inc.reporterLastName}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <button className="btn btn-ghost" onClick={() => navigate(`/incidents/edit/${inc.id}`)} style={{ padding: '0.5rem', color: 'var(--text-primary)' }} title="Edit Record (Management Only)">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentList;
