import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import '../../assets/css/student/Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

    useEffect(() => {
        studentApi.getNotifications()
            .then(res => {
                setNotifications(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const markAsRead = (id) => {
        const notif = notifications.find(n => n.id === id);
        if (notif && !notif.isRead) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
            // Optional: call API to mark as read
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        // Optional: call API to mark all as read
    };

    const getIconConfig = (title) => {
        const t = (title || '').toLowerCase();
        if (t.includes('chấp nhận') || t.includes('accepted')) return { icon: 'check_circle', class: 'bg-accept' };
        if (t.includes('từ chối') || t.includes('rejected')) return { icon: 'cancel', class: 'bg-reject' };
        if (t.includes('ứng tuyển') || t.includes('apply')) return { icon: 'send', class: 'bg-apply' };
        if (t.includes('phỏng vấn') || t.includes('interview')) return { icon: 'event', class: 'bg-interview' };
        return { icon: 'notifications', class: 'bg-system' };
    };

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return (
        <div className="notifications-container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="premium-spinner" style={{ marginBottom: '1.5rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Đang tải thông báo của bạn...</p>
            </div>
        </div>
    );

    return (
        <div className="notifications-container">
            <main className="notifications-content">
                {/* Breadcrumb */}
                <nav className="notifications-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Thông báo</span>
                </nav>

                {/* Header */}
                <header className="notifications-header">
                    <div className="notifications-title-group">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h1>Thông báo</h1>
                            {unreadCount > 0 && <span className="unread-badge">{unreadCount} tin mới</span>}
                        </div>
                        <p>Theo dõi tiến độ hồ sơ và tin tức quan trọng.</p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="mark-all-btn" onClick={markAllRead}>
                            <span className="material-symbols-outlined">done_all</span>
                            Đánh dấu đã đọc tất cả
                        </button>
                    )}
                </header>

                {/* Filter Tabs */}
                <div className="notifications-tabs">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'unread', label: 'Chưa đọc' },
                        { key: 'read', label: 'Đã đọc' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`tab-btn ${filter === tab.key ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List Content */}
                {filtered.length === 0 ? (
                    <div className="empty-notifications">
                        <div className="empty-icon-box">
                            <span className="material-symbols-outlined">{filter === 'unread' ? 'done_all' : 'notifications_off'}</span>
                        </div>
                        <h3>{filter === 'unread' ? 'Bạn đã đọc hết!' : 'Chưa có thông báo'}</h3>
                        <p>{filter === 'unread' ? 'Hộp thư của bạn sạch sẽ rồi đó.' : 'Khi có tin nhắn mới từ nhà tuyển dụng, chúng tôi sẽ báo cho bạn ngay.'}</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {filtered.map(n => {
                            const iconConfig = getIconConfig(n.title);
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`notification-card ${n.isRead ? 'read' : 'unread'}`}
                                >
                                    <div className={`notif-icon-box ${iconConfig.class}`}>
                                        <span className="material-symbols-outlined">{iconConfig.icon}</span>
                                    </div>
                                    <div className="notif-info">
                                        <div className="notif-top">
                                            <h3 className="notif-title">{n.title || 'Cập nhật từ hệ thống'}</h3>
                                            <span className="notif-time">{n.createdAt || 'Vừa xong'}</span>
                                        </div>
                                        <p className="notif-message">{n.content || n.message}</p>
                                    </div>
                                    {!n.isRead && (
                                        <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Notifications;
