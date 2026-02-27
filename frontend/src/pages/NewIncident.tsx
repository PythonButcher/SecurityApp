import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle } from 'lucide-react';

const NewIncident: React.FC = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        incidentDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm format for datetime-local
        type: '0',
        status: '0',
        locationWithinCourthouse: '',
        description: '',
        reporterFirstName: '',
        reporterLastName: '',
        reporterBadgeNumber: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Convert to format expected by DTO
            const payload = {
                ...formData,
                type: parseInt(formData.type, 10),
                status: parseInt(formData.status, 10),
                // Ensure date string is fully ISO 8601 compliant (UTC)
                incidentDate: new Date(formData.incidentDate).toISOString()
            };

            const response = await fetch('http://localhost:5184/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.text();
                throw new Error(errData || 'Failed to create incident.');
            }

            // Success! Navigate back to list
            navigate('/incidents');

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Create New Incident Record</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Fill out the details below to log a new security event.</p>
                </div>
                <button className="btn btn-ghost" onClick={() => navigate('/incidents')} type="button">
                    <X size={18} /> Cancel
                </button>
            </div>

            {error && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '2rem',
                    backgroundColor: 'var(--bg-glass)',
                    border: '1px solid var(--accent-danger)',
                    borderRadius: '8px',
                    color: 'var(--accent-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>

                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>General Information</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="incidentDate">Date & Time of Incident *</label>
                        <input
                            type="datetime-local"
                            id="incidentDate"
                            name="incidentDate"
                            className="input-field"
                            required
                            value={formData.incidentDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="locationWithinCourthouse">Location (Room/Area) *</label>
                        <input
                            type="text"
                            id="locationWithinCourthouse"
                            name="locationWithinCourthouse"
                            className="input-field"
                            placeholder="e.g. Courtroom 302, Front Security Desk"
                            required
                            value={formData.locationWithinCourthouse}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="type">Incident Classification *</label>
                        <select
                            id="type"
                            name="type"
                            className="input-field"
                            required
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="0">Physical Altercation</option>
                            <option value="1">Verbal Threat</option>
                            <option value="2">Medical Emergency</option>
                            <option value="3">Contraband Found</option>
                            <option value="4">Other</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="status">Initial Status *</label>
                        <select
                            id="status"
                            name="status"
                            className="input-field"
                            required
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="0">Open</option>
                            <option value="1">Under Review</option>
                            <option value="2">Escalated</option>
                            <option value="3">Closed</option>
                        </select>
                    </div>
                </div>


                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Reporter Details</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="reporterFirstName">First Name *</label>
                        <input
                            type="text"
                            id="reporterFirstName"
                            name="reporterFirstName"
                            className="input-field"
                            required
                            value={formData.reporterFirstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="reporterLastName">Last Name *</label>
                        <input
                            type="text"
                            id="reporterLastName"
                            name="reporterLastName"
                            className="input-field"
                            required
                            value={formData.reporterLastName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="reporterBadgeNumber">Badge / ID Number</label>
                        <input
                            type="text"
                            id="reporterBadgeNumber"
                            name="reporterBadgeNumber"
                            className="input-field"
                            value={formData.reporterBadgeNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Narrative</h3>

                <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                    <label className="input-label" htmlFor="description">Detailed Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        className="input-field"
                        rows={6}
                        placeholder="Provide a factual, detailed account of the incident..."
                        required
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => navigate('/incidents')} disabled={submitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : <><Save size={18} /> Save Record</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default NewIncident;
