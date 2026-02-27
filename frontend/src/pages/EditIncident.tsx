import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, AlertCircle } from 'lucide-react';

const EditIncident: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        type: '0',
        status: '0',
        locationWithinCourthouse: '',
        description: '', // Maps to Narrative
    });

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const response = await fetch(`http://localhost:5184/api/incidents/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch incident.');
                }
                const data = await response.json();

                setFormData({
                    type: data.type !== undefined ? data.type.toString() : '0',
                    status: data.status !== undefined ? data.status.toString() : '0',
                    locationWithinCourthouse: data.locationWithinCourthouse || '',
                    description: data.narrative || '',
                });
            } catch (err: any) {
                setError(err.message || 'Error loading existing record.');
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
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
            const payload = {
                id: id,
                type: parseInt(formData.type, 10),
                status: parseInt(formData.status, 10),
                locationWithinCourthouse: formData.locationWithinCourthouse,
                narrative: formData.description
            };

            const response = await fetch(`http://localhost:5184/api/incidents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.text();
                throw new Error(errData || 'Failed to update incident.');
            }

            navigate('/incidents');

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading incident data...</div>;
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Update Incident Record</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Modify the details below to update this security event.</p>
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

                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Update Information</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" htmlFor="locationWithinCourthouse">Location (Room/Area) *</label>
                        <input
                            type="text"
                            id="locationWithinCourthouse"
                            name="locationWithinCourthouse"
                            className="input-field"
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
                        <label className="input-label" htmlFor="status">Status *</label>
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
                        {submitting ? 'Submitting...' : <><Save size={18} /> Update Record</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditIncident;
