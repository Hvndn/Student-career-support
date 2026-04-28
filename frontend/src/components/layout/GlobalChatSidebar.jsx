import React, { useState, useEffect, useMemo } from 'react';
import { useMessaging } from '../../context/MessagingContext';
import { chatApi } from '../../api';
import '../../assets/css/layout/GlobalChatSidebar.css';

/**
 * Persistent Chat Sidebar listing all potential contacts (Admins, Companies).
 * Features: Search bar, all-user directory, and real-time unread badges.
 */
const GlobalChatSidebar = ({ onClose }) => {
    const { 
        conversations, 
        directory,
        loadMessages, 
        activeChat, 
        unreadCount, 
        isChatOpen, 
        setIsChatOpen 
    } = useMessaging();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('recent'); // 'recent' or 'all'

    // Filter list based on search term
    const filteredDirectory = useMemo(() => {
        if (!searchTerm) return directory;
        return directory.filter(u => 
            (u?.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u?.partnerRole || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [directory, searchTerm]);

    const recentConversations = useMemo(() => {
        if (!searchTerm) return conversations;
        return conversations.filter(c => 
            (c?.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [conversations, searchTerm]);

    const handleSelectPartner = (partnerId) => {
        loadMessages(partnerId);
        // On mobile, we might want to close something, but on desktop it's fixed
    };

    return (
        <aside className={`global-chat-sidebar ${isChatOpen ? 'is-open' : ''}`}>
            <div className="gcs-header">
                <div className="gcs-title-row">
                    <h3>Trò chuyện</h3>
                    <div className="gcs-title-right">
                        {unreadCount > 0 && <span className="gcs-badge-total">{unreadCount}</span>}
                        <button className="gcs-close-btn" onClick={() => setIsChatOpen(false)} title="Đóng">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
                <div className="gcs-search-box">
                    <span className="material-symbols-outlined gcs-search-icon">search</span>
                    <input 
                        type="text" 
                        placeholder="Tìm người liên hệ..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="gcs-tabs">
                    <button 
                        className={`gcs-tab ${viewMode === 'recent' ? 'active' : ''}`}
                        onClick={() => setViewMode('recent')}
                    >
                        Gần đây
                    </button>
                    <button 
                        className={`gcs-tab ${viewMode === 'all' ? 'active' : ''}`}
                        onClick={() => setViewMode('all')}
                    >
                        Danh bạ (Tất cả)
                    </button>
                </div>
            </div>

            <div className="gcs-list custom-scrollbar">
                {viewMode === 'recent' ? (
                    recentConversations.length > 0 ? (
                        recentConversations.map(conv => (
                            <div 
                                key={conv.partnerId} 
                                className={`gcs-item ${activeChat === conv.partnerId ? 'active' : ''} ${conv.isUnread ? 'unread' : ''}`}
                                onClick={() => handleSelectPartner(conv.partnerId)}
                            >
                                <div className="gcs-avatar">
                                    {conv.partnerAvatar ? (
                                        <img src={conv.partnerAvatar} alt={conv.partnerName || 'User'} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {(conv.partnerName || '?').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {conv.isUnread && <span className="unread-dot"></span>}
                                </div>
                                <div className="gcs-info">
                                    <div className="gcs-info-top">
                                        <span className="partner-name">{conv.partnerName || 'Người dùng ẩn danh'}</span>
                                        <span className="message-time">{conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                    </div>
                                    <p className="last-message">{conv.lastMessage || 'Chưa có tin nhắn'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="gcs-empty">Chưa có hội thoại nào</div>
                    )
                ) : (
                    filteredDirectory.length > 0 ? (
                        <>
                            <div className="directory-section-label">ADMINS & CÔNG TY</div>
                            {filteredDirectory.map(user => (
                                <div 
                                    key={user.partnerId} 
                                    className={`gcs-item directory-item ${activeChat === user.partnerId ? 'active' : ''}`}
                                    onClick={() => handleSelectPartner(user.partnerId)}
                                >
                                    <div className="gcs-avatar small">
                                        {user.partnerAvatar ? (
                                            <img src={user.partnerAvatar} alt={user.partnerName || 'User'} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {(user.partnerName || '?').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="gcs-info">
                                        <span className="partner-name">{user.partnerName || 'Người dùng ẩn danh'}</span>
                                        <span className="partner-role">{user.partnerRole === 'admin' ? 'Hệ thống' : 'Nhà tuyển dụng'}</span>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="gcs-empty">Không tìm thấy ai</div>
                    )
                )}
            </div>
        </aside>
    );
};

export default GlobalChatSidebar;
