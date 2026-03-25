import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api';

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentApi.getMyApplications()
            .then(res => {
                setApps(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'REVIEWING': return { background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' };
            case 'ACCEPTED': return { background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' };
            case 'REJECTED': return { background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)' };
            default: return { background: 'var(--surface)', color: 'var(--text-muted)' };
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải danh sách...</div>;

    return (
        <div className="container" style={{ marginTop: '3rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Việc làm <span className="gradient-text">Đã ứng tuyển</span></h1>
            
            <div className="glass" style={{ padding: '2rem' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Công việc</th>
                            <th style={{ padding: '1rem' }}>Công ty</th>
                            <th style={{ padding: '1rem' }}>Ngày ứng tuyển</th>
                            <th style={{ padding: '1rem' }}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.5rem 1rem', fontWeight: 'bold' }}>{app.jobTitle}</td>
                                <td style={{ padding: '1.5rem 1rem' }}>{app.companyName}</td>
                                <td style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>{app.appliedDate}</td>
                                <td style={{ padding: '1.5rem 1rem' }}>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '6px', 
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        ...getStatusStyle(app.status)
                                    }}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {apps.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Bạn chưa nộp đơn nào.</div>}
            </div>
        </div>
    );
};

export default Applications;
