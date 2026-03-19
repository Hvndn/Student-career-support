import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../api';


const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const filteredJobs = jobs.filter(job => {
        const q = search.toLowerCase();
        return (
            job.title?.toLowerCase().includes(q) ||
            job.companyName?.toLowerCase().includes(q) ||
            job.location?.toLowerCase().includes(q)
        );
    });

    useEffect(() => {
        jobApi.getJobs()
            .then(res => {
                setJobs(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="fade-in" style={{ paddingBottom: '5rem' }}>
            {/* Hero Section */}
            <header style={{ 
                padding: '8rem 2rem 6rem', 
                textAlign: 'center', 
                background: 'radial-gradient(circle at 50% 50%, rgba(129, 140, 248, 0.15) 0%, transparent 70%)'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.04em', fontFamily: 'arial, ' }}>
                        Tìm kiếm <span className="gradient-text">Tương lai</span> <br/> bắt đầu từ đây.
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem', fontWeight: '400' }}>
                        Kết nối những tài năng hàng đầu với các doanh nghiệp đột phá. Đơn giản, hiện đại và hiệu quả.
                    </p>
                    
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="glass" style={{ 
                            display: 'flex', 
                            padding: '0.5rem', 
                            gap: '0.5rem', 
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.15)'
                        }}>
                            <input 
                                type="text" 
                                placeholder="Tên công việc, kỹ năng hoặc công ty..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ 
                                    flex: 1, 
                                    background: 'transparent', 
                                    border: 'none', 
                                    padding: '1rem 1.5rem', 
                                    color: '#000', 
                                    fontSize: '1.1rem',
                                    outline: 'none'
                                }}
                            />
                            <button className="btn btn-primary" style={{ borderRadius: '14px' }}>
                                Tìm kiếm <span style={{ marginLeft: '0.5rem' }}>🚀</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container" style={{ marginTop: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Cơ hội <span className="gradient-text">Mới nhất</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Khám phá những công việc phù hợp nhất với bạn hôm nay.</p>
                    </div>
                    <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>Xem tất cả →</Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <div className="glass" style={{ display: 'inline-block', padding: '1rem 2rem' }}>Đang tải danh sách việc làm...</div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <div className="glass" style={{ display: 'inline-block', padding: '1rem 2rem' }}>Không tìm thấy kết quả cho "{search}"</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {filteredJobs.map(job => (
                            <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', fontWeight: '600' }}>
                                        <Link to={`/jobs/${job.id}`} className="nav-link">{job.title}</Link>
                                    </h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem' }}>{job.companyName}</p>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                    <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {job.location}</span>
                                    <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--success)' }}>💰 {job.salary}</span>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>2 ngày trước</span>
                                    <Link to={`/jobs/${job.id}`} className="btn glass" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Chi tiết</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};


export default Home;
