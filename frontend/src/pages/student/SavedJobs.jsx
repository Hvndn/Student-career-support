import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentApi.getSavedJobs()
            .then(res => {
                setJobs(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải...</div>;

    return (
        <div className="fade-in" style={{ padding: '3rem 2rem 6rem' }}>
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.8rem' }}>
                        Việc làm <span className="gradient-text">Đã lưu</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Xem lại những cơ hội bạn đã quan tâm.</p>
                </header>
                
                {jobs.length === 0 ? (
                    <div className="card glass" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🔖</div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Danh sách việc làm đã lưu của bạn đang trống.</p>
                        <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Khám phá công việc ngay</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {jobs.map(job => (
                            <div key={job.id} className="card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', fontWeight: '700' }}>{job.title}</h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{job.companyName}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                                    <span>📍 {job.location}</span>
                                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>{job.salary}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                    <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{ flex: 2, textAlign: 'center', justifyContent: 'center' }}>Chi tiết</Link>
                                    <button className="btn glass" style={{ flex: 1, color: 'var(--error)', padding: '0.6rem', justifyContent: 'center' }}>Xóa</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default SavedJobs;
