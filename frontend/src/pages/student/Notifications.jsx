import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import '../../assets/css/common/Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

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
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const getIcon = (title) => {
        const t = (title || '').toLowerCase();
        if (t.includes('chấp nhận') || t.includes('accepted')) return { icon: 'check_circle', class: 'icon-green' };
        if (t.includes('từ chối') || t.includes('rejected')) return { icon: 'cancel', class: 'icon-red' };
        if (t.includes('ứng tuyển') || t.includes('apply')) return { icon: 'send', class: 'icon-blue' };
        if (t.includes('phỏng vấn') || t.includes('interview')) return { icon: 'event', class: 'icon-purple' };
        return { icon: 'notifications', class: 'icon-amber' };
    };

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return (
        <div className="notifications-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <span className="material-symbols-outlined premium-spinner">refresh</span>
                <p className="loading-text" style={{ marginTop: '1rem' }}>Đang tải thông báo...</p>
            </div>
        </div>
    );

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                {/* Breadcrumb */}
                <nav className="notif-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>Thông báo</span>
                </nav>

                {/* Header */}
                <div className="notif-header">
                    <div>
                        <h1 className="notif-title">Thông báo</h1>
                        <p className="notif-desc">Cập nhật mới nhất về đơn ứng tuyển và hoạt động của bạn.</p>
                    </div>
                    <div className="notif-actions">
                        {unreadCount > 0 && (
                            <span className="notif-unread-badge">
                                {unreadCount} chưa đọc
                            </span>
                        )}
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="btn-mark-all">
                                <span className="material-symbols-outlined">done_all</span>
                                Đọc tất cả
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="notif-tabs">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'unread', label: 'Chưa đọc' },
                        { key: 'read', label: 'Đã đọc' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`notif-tab ${filter === tab.key ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {filtered.length === 0 ? (
                    <div className="empty-notif">
                        <span className="material-symbols-outlined">notifications_off</span>
                        <h3>
                            {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo'}
                        </h3>
                        <p>
                            {filter === 'unread'
                                ? 'Bạn đã đọc hết tất cả thông báo.'
                                : 'Khi có cập nhật mới về đơn ứng tuyển, thông báo sẽ xuất hiện ở đây.'}
                        </p>
                    </div>
                ) : (
                    <div className="notif-list">
                        {filtered.map(n => {
                            const iconConfig = getIcon(n.title);
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`notif-item ${n.isRead ? 'read' : 'unread'}`}
                                >
                                    {/* Icon */}
                                    <div className={`notif-icon-wrapper ${iconConfig.class}`}>
                                        <span className="material-symbols-outlined">{iconConfig.icon}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="notif-content">
                                        <div className="notif-header-row">
                                            <h3 className="notif-item-title">
                                                {n.title || 'Thông báo mới'}
                                            </h3>
                                            <div className="notif-meta">
                                                {!n.isRead && <span className="unread-dot"></span>}
                                                <span className="notif-time">
                                                    {n.createdAt || 'Vừa xong'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="notif-message">
                                            {n.content || n.message}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
