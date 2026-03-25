import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        jobApi.getJobs()
            .then(res => {
                setJobs(res.data.data);
                setFiltered(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            jobs.filter(j =>
                j.title?.toLowerCase().includes(q) ||
                j.companyName?.toLowerCase().includes(q) ||
                j.location?.toLowerCase().includes(q)
            )
        );
    }, [search, jobs]);
    
    const formatDate = (dateValue) => {
        if (!dateValue) return 'Không giới hạn';
        if (typeof dateValue === 'string') {
            const d = new Date(dateValue);
            if (isNaN(d.getTime())) return dateValue;
            return d.toLocaleDateString('vi-VN');
        }
        if (Array.isArray(dateValue) && dateValue.length >= 3) {
            return `${dateValue[2]}/${dateValue[1]}/${dateValue[0]}`;
        }
        return String(dateValue);
    };

    return (
        <div className="fade-in" style={{ padding: '4rem 2rem 6rem' }}>
            <div className="container">
                {/* Header */}
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                        Tất cả <span className="gradient-text">Việc làm</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                        Tìm kiếm cơ hội nghề nghiệp phù hợp với bạn nhất.
                    </p>

                    {/* Search */}
                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <div className="glass" style={{
                            display: 'flex',
                            padding: '0.5rem',
                            gap: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.4)'
                        }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, công ty, địa điểm..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '0.8rem 1.2rem',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            <button className="btn btn-primary" style={{ borderRadius: '14px', padding: '0 1.5rem' }}>
                                🔍 Tìm
                            </button>
                        </div>
                    </div>
                </header>

                {/* Results count */}
                {!loading && (
                    <div style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Tìm thấy <strong style={{ color: 'white' }}>{filtered.length}</strong> công việc
                    </div>
                )}

                {/* Job List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
                        <div className="glass" style={{ display: 'inline-block', padding: '1.2rem 3rem' }}>
                            Đang tải danh sách việc làm...
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card glass" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.4 }}>🔍</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            Không tìm thấy công việc phù hợp với "{search}".
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
                        {filtered.map(job => (
                            <div key={job.id} className="card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                                        <Link to={`/jobs/${job.id}`} className="nav-link">{job.title}</Link>
                                    </h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{job.companyName}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                    <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        📍 {job.location}
                                    </span>
                                    <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600' }}>
                                        💰 {job.salary}
                                    </span>
                                    {job.jobType && (
                                        <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--secondary)' }}>
                                            🕒 {job.jobType}
                                        </span>
                                    )}
                                    <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--error)', fontWeight: '500' }}>
                                        📅 {formatDate(job.deadline)}
                                    </span>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobList;
