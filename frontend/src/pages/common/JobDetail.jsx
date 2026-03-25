import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        jobApi.getJobDetail(id)
            .then(res => {
                setJob(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const user = JSON.parse(localStorage.getItem('user'));

    const handleApply = async () => {
        try {
            const res = await studentApi.applyJob(id);
            setMessage(res.data.message);
            setJob(prev => ({ ...prev, isApplied: true }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Bạn cần đăng nhập để ứng tuyển!');
        }
    };

    const handleCancel = async () => {
        try {
            const res = await studentApi.cancelApplication(id);
            setMessage(res.data.message);
            setJob(prev => ({ ...prev, isApplied: false }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi hủy ứng tuyển');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải...</div>;
    if (!job) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Không tìm thấy công việc!</div>;

    const renderApplyButton = () => {
        if (!user) {
            return (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '500' }}>✨ Bạn cần đăng nhập để ứng tuyển!</p>
                    <a href="/login" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.8rem 2.5rem' }}>Đăng nhập ngay</a>
                </div>
            );
        }

        if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_COMPANY') {
            return null;
        }

        if (user.role === 'ROLE_STUDENT') {
            return job.isApplied ? (
                <button onClick={handleCancel} className="btn glass" style={{ flex: 3, height: '3.5rem', fontSize: '1.1rem', justifyContent: 'center', color: 'var(--error)', border: '1px solid var(--error)' }}>
                    Hủy ứng tuyển ↩️
                </button>
            ) : (
                <button onClick={handleApply} className="btn btn-primary" style={{ flex: 3, height: '3.5rem', fontSize: '1.1rem', justifyContent: 'center' }}>
                    Ứng tuyển ngay 🚀
                </button>
            );
        }

        return null;
    };

    return (
        <div className="fade-in" style={{ padding: '4rem 2rem 6rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="card glass" style={{ 
                    padding: '3.5rem', 
                    boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.12)'
                }}>
                    <header style={{ 
                        borderBottom: '1px solid var(--border)', 
                        paddingBottom: '2.5rem', 
                        marginBottom: '2.5rem',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.8rem', letterSpacing: '-0.03em' }}>
                                    {job.title}
                                </h1>
                                <p style={{ color: 'var(--primary)', fontSize: '1.4rem', fontWeight: '600' }}>
                                    {job.companyName}
                                </p>
                            </div>
                            <div className="glass" style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>🏢</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
                                📍 {job.location}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '1.1rem', fontWeight: '600' }}>
                                💰 {job.salary}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '1rem', fontWeight: '500' }}>
                                🕒 {job.jobType}
                            </span>
                        </div>
                    </header>

                    <div style={{ marginBottom: '4rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Mô tả công việc</h3>
                        <div style={{ 
                            whiteSpace: 'pre-wrap', 
                            color: 'var(--text-muted)', 
                            lineHeight: '1.8',
                            fontSize: '1.1rem'
                        }}>
                            {job.description}
                        </div>
                    </div>

                    {message && (
                        <div className="fade-in" style={{ 
                            padding: '1.2rem', 
                            borderRadius: '12px', 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            color: 'var(--success)', 
                            marginBottom: '2rem', 
                            textAlign: 'center',
                            fontWeight: '600',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            ✨ {message}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {renderApplyButton()}
                        {(user && user.role === 'ROLE_STUDENT') && (
                            <button className="btn glass" style={{ flex: 1, height: '3.5rem', fontSize: '1.1rem', justifyContent: 'center' }}>
                                🔖 Lưu tin
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default JobDetail;
