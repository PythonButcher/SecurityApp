import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Clock, FileWarning, AlertTriangle, Filter } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { subDays, isAfter } from 'date-fns';

interface Incident {
    id: string;
    incidentDate: string;
    type: number;
    status: number;
    locationWithinCourthouse: string;
}

// Fallback colors are no longer used for pie chart as we use variables directly below
const COLORS = ['var(--accent-primary)', 'var(--accent-warning)', 'var(--accent-danger)', 'var(--text-muted)', 'var(--accent-success)'];

const Dashboard: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    // Slicer States
    const [timeframe, setTimeframe] = useState<string>('30'); // days
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect(() => {
        fetch('http://localhost:5184/api/incidents')
            .then(res => res.json())
            .then(data => setIncidents(data))
            .catch(err => console.error("Failed to fetch incidents:", err));
    }, []);

    // Apply Slicers
    const filteredIncidents = useMemo(() => {
        return incidents.filter(inc => {
            // 1. Timeframe Filter
            let dateMatch = true;
            if (timeframe !== 'all') {
                const cutoff = subDays(new Date(), parseInt(timeframe));
                dateMatch = isAfter(new Date(inc.incidentDate), cutoff);
            }

            // 2. Status Filter
            const statusMatch = statusFilter === 'all' || inc.status === parseInt(statusFilter);

            // 3. Type Filter
            const typeMatch = typeFilter === 'all' || inc.type === parseInt(typeFilter);

            return dateMatch && statusMatch && typeMatch;
        });
    }, [incidents, timeframe, statusFilter, typeFilter]);

    // KPI Calculations based on filtered data
    const openCount = filteredIncidents.filter(i => i.status === 0).length;
    const reviewCount = filteredIncidents.filter(i => i.status === 1).length;
    const escalatedCount = filteredIncidents.filter(i => i.status === 2).length;

    // Chart Data Formatting: Incidents by Type
    const incidentsByType = useMemo(() => {
        const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
        filteredIncidents.forEach(inc => { counts[inc.type] = (counts[inc.type] || 0) + 1; });
        return [
            { name: 'Physical', count: counts[0] },
            { name: 'Verbal', count: counts[1] },
            { name: 'Medical', count: counts[2] },
            { name: 'Contraband', count: counts[3] },
            { name: 'Other', count: counts[4] }
        ].filter(x => x.count > 0);
    }, [filteredIncidents]);

    // Chart Data Formatting: Incidents by Status (Pie)
    const incidentsByStatus = useMemo(() => {
        const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
        filteredIncidents.forEach(inc => { counts[inc.status] = (counts[inc.status] || 0) + 1; });
        return [
            { name: 'Open', value: counts[0] },
            { name: 'Review', value: counts[1] },
            { name: 'Escalated', value: counts[2] },
            { name: 'Closed', value: counts[3] }
        ];
    }, [filteredIncidents]);

    // Chart Data Formatting: Trend Line (Last 7/30 days grouped)
    const trendData = useMemo(() => {
        const map = new Map<string, number>();
        filteredIncidents.forEach(inc => {
            const dateStr = new Date(inc.incidentDate).toISOString().split('T')[0];
            map.set(dateStr, (map.get(dateStr) || 0) + 1);
        });

        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date)); // Sort chronologically
    }, [filteredIncidents]);

    // Chart Data Formatting: Location Geography (Top 5)
    const incidentsByLocation = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredIncidents.forEach(inc => {
            // Simplify location name for chart readability if needed, or just use raw strings
            counts[inc.locationWithinCourthouse] = (counts[inc.locationWithinCourthouse] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // top 5 most problematic spots
    }, [filteredIncidents]);

    // Chart Data Formatting: Division vs Type (Stacked Bar / Heatmap Alternative)
    const divisionVsType = useMemo(() => {
        // Since we don't have 'division' strongly typed mapped to the frontend yet, 
        // we'll slice by 'status' across the 'types' for a deep drill-down visual,
        // which represents how severe each classification currently is.
        const typeMap: Record<number, { name: string, open: number, review: number, escalated: number, closed: number }> = {
            0: { name: 'Physical', open: 0, review: 0, escalated: 0, closed: 0 },
            1: { name: 'Verbal', open: 0, review: 0, escalated: 0, closed: 0 },
            2: { name: 'Medical', open: 0, review: 0, escalated: 0, closed: 0 },
            3: { name: 'Contraband', open: 0, review: 0, escalated: 0, closed: 0 },
            4: { name: 'Other', open: 0, review: 0, escalated: 0, closed: 0 }
        };

        filteredIncidents.forEach(inc => {
            // Safety check: if the database returns a Type enum number we haven't mapped, default to "Other" (4)
            const mapKey = typeMap[inc.type] ? inc.type : 4;

            if (inc.status === 0) typeMap[mapKey].open++;
            if (inc.status === 1) typeMap[mapKey].review++;
            if (inc.status === 2) typeMap[mapKey].escalated++;
            if (inc.status === 3) typeMap[mapKey].closed++;
        });

        return Object.values(typeMap).filter(x => x.open + x.review + x.escalated + x.closed > 0);
    }, [filteredIncidents]);



    return (
        <div className="animate-fade-in">

            {/* Global Slicers Panel */}
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Filter size={18} />
                    <strong>SLICERS</strong>
                </div>

                <div className="input-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <span className="input-label" style={{ marginRight: '0.5rem' }}>Timeframe:</span>
                    <select className="input-field" style={{ width: 'auto', padding: '0.5rem' }} value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                <div className="input-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <span className="input-label" style={{ marginRight: '0.5rem' }}>Status:</span>
                    <select className="input-field" style={{ width: 'auto', padding: '0.5rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">Any Status</option>
                        <option value="0">Open</option>
                        <option value="1">Under Review</option>
                        <option value="2">Escalated</option>
                        <option value="3">Closed</option>
                    </select>
                </div>

                <div className="input-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <span className="input-label" style={{ marginRight: '0.5rem' }}>Type:</span>
                    <select className="input-field" style={{ width: 'auto', padding: '0.5rem' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">Any Incident Type</option>
                        <option value="0">Physical Altercation</option>
                        <option value="1">Verbal Threat</option>
                        <option value="2">Medical Emergency</option>
                        <option value="3">Contraband</option>
                    </select>
                </div>

                <div style={{ marginLeft: 'auto', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {filteredIncidents.length} Records Match
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Dynamically calculated KPI Cards */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open</p>
                            <h1 style={{ margin: '0.5rem 0 0 0' }}>{openCount}</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: '8px', color: 'var(--accent-primary)', border: '1px solid var(--border-glass)' }}>
                            <FileWarning size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escalated</p>
                            <h1 style={{ margin: '0.5rem 0 0 0', color: 'var(--accent-danger)' }}>{escalatedCount}</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: '8px', color: 'var(--accent-danger)', border: '1px solid var(--border-glass)' }}>
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Under Review</p>
                            <h1 style={{ margin: '0.5rem 0 0 0', color: 'var(--accent-warning)' }}>{reviewCount}</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: '8px', color: 'var(--accent-warning)', border: '1px solid var(--border-glass)' }}>
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cleared</p>
                            <h1 style={{ margin: '0.5rem 0 0 0', color: 'var(--accent-success)' }}>{filteredIncidents.length - openCount - reviewCount - escalatedCount}</h1>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: '8px', color: 'var(--accent-success)', border: '1px solid var(--border-glass)' }}>
                            <Shield size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Incident Volume Trend</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                            <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickMargin={10} minTickGap={20} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Classification Pivot</h3>
                    <ResponsiveContainer width="100%" height="50%">
                        <BarChart data={incidentsByType} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="var(--text-muted)" hide />
                            <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={11} width={70} />
                            <Tooltip cursor={{ fill: 'var(--bg-glass)' }} contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-glass)' }} />
                            <Bar dataKey="count" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>

                    <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1rem' }}>Current Status Mix</h3>
                    <ResponsiveContainer width="100%" height="40%">
                        <PieChart>
                            <Pie data={incidentsByStatus} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                                {incidentsByStatus.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-glass)' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', height: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Top 5 Incident Hotspots</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={incidentsByLocation} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} interval={0} angle={-25} textAnchor="end" height={60} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'var(--bg-glass)' }} contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-glass)' }} />
                            <Bar dataKey="count" fill="var(--accent-warning)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', height: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Severity Matrix: Type vs Lifecycle</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={divisionVsType} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="var(--text-muted)" hide />
                            <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={11} width={80} />
                            <Tooltip
                                cursor={{ fill: 'var(--bg-glass)' }}
                                contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-glass)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)', paddingTop: '10px' }} />

                            <Bar dataKey="open" name="Open" stackId="a" fill="var(--accent-primary)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="review" name="Under Review" stackId="a" fill="var(--accent-warning)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="escalated" name="Escalated" stackId="a" fill="var(--accent-danger)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="closed" name="Closed" stackId="a" fill="var(--accent-success)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
