import React, { useState, useEffect } from 'react';
import { studentApi } from '../api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentApi.getNotifications()
            .then(res => {
                setNotifications(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const markAsRead = (id) => {
        // Mock mark as read
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải thông báo...</div>;

    return (
        <div className="container" style={{ marginTop: '3rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Trung tâm <span className="gradient-text">Thông báo</span></h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(n => (
                    <div 
                        key={n.id} 
                        className="card glass" 
                        style={{ 
                            padding: '1.5rem', 
                            borderLeft: n.isRead ? '1px solid var(--border)' : '4px solid var(--primary)',
                            opacity: n.isRead ? 0.7 : 1,
                            cursor: 'pointer'
                        }}
                        onClick={() => markAsRead(n.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold', color: n.isRead ? 'var(--text)' : 'var(--primary)' }}>
                                {n.title || 'Thông báo mới'}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.createdAt || 'Vừa xong'}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{n.content || n.message}</p>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Bạn không có thông báo nào.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
