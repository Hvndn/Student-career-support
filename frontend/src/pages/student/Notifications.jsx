import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';

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
        if (t.includes('chấp nhận') || t.includes('accepted')) return { icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-600' };
        if (t.includes('từ chối') || t.includes('rejected')) return { icon: 'cancel', bg: 'bg-red-50', color: 'text-red-500' };
        if (t.includes('ứng tuyển') || t.includes('apply')) return { icon: 'send', bg: 'bg-blue-50', color: 'text-blue-600' };
        if (t.includes('phỏng vấn') || t.includes('interview')) return { icon: 'event', bg: 'bg-purple-50', color: 'text-purple-600' };
        return { icon: 'notifications', bg: 'bg-amber-50', color: 'text-amber-600' };
    };

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafd', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            <div className="text-center space-y-3">
                <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">refresh</span>
                <p className="text-slate-500 text-sm">Đang tải thông báo...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#f8fafd', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                    <Link className="hover:text-blue-600 transition-colors" to="/">Trang chủ</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Thông báo</span>
                </nav>

                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Thông báo</h1>
                        <p className="text-slate-500 text-sm mt-1">Cập nhật mới nhất về đơn ứng tuyển và hoạt động của bạn.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                {unreadCount} chưa đọc
                            </span>
                        )}
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">done_all</span>
                                Đọc tất cả
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-100 shadow-sm mb-6 w-fit">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'unread', label: 'Chưa đọc' },
                        { key: 'read', label: 'Đã đọc' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                filter === tab.key
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">notifications_off</span>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo'}
                        </h3>
                        <p className="text-slate-500 text-sm">
                            {filter === 'unread'
                                ? 'Bạn đã đọc hết tất cả thông báo.'
                                : 'Khi có cập nhật mới về đơn ứng tuyển, thông báo sẽ xuất hiện ở đây.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(n => {
                            const iconConfig = getIcon(n.title);
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`group bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                                        n.isRead
                                            ? 'border-slate-100 opacity-70 hover:opacity-100'
                                            : 'border-blue-100 shadow-sm'
                                    }`}
                                >
                                    <div className="flex gap-3.5">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 shrink-0 rounded-xl ${iconConfig.bg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined text-xl ${iconConfig.color}`}>{iconConfig.icon}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className={`text-sm font-bold truncate ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                                                    {n.title || 'Thông báo mới'}
                                                </h3>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {!n.isRead && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                                    )}
                                                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                                        {n.createdAt || 'Vừa xong'}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                {n.content || n.message}
                                            </p>
                                        </div>
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
