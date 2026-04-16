import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useMessaging } from '../../context/MessagingContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminChat.css';

const AdminChat = () => {
    const { 
        messages, 
        activeChat, 
        sendMessage, 
        loadMessages, 
        conversations,
        isConnected 
    } = useMessaging();

    const [chatInput, setChatInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !activeChat) return;

        const success = await sendMessage(activeChat, chatInput);
        if (success) {
            setChatInput('');
        }
    };

    const filteredConversations = useMemo(() => {
        if (!searchTerm) return conversations;
        return conversations.filter(c => 
            (c.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [conversations, searchTerm]);

    const activePartner = conversations.find(c => c.partnerId === activeChat);

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar />
                <main className="admin-body">
                    <section className="admin-header-section">
                        <div className="header-text">
                            <h1>Trò chuyện</h1>
                            <p>Trao đổi trực tiếp với sinh viên và doanh nghiệp tham gia hệ thống.</p>
                        </div>
                    </section>

                    <div className="admin-chat-layout">
                        {/* Sidebar */}
                        <aside className="admin-chat-sidebar">
                            <div className="admin-chat-sidebar-header">
                                <div className="admin-chat-search">
                                    <span className="material-symbols-outlined">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm tin nhắn hoặc người dùng..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="admin-chat-list custom-scrollbar">
                                {filteredConversations.length > 0 ? (
                                    filteredConversations.map(conv => (
                                        <div 
                                            key={conv.partnerId} 
                                            className={`admin-chat-item ${activeChat === conv.partnerId ? 'active' : ''}`}
                                            onClick={() => loadMessages(conv.partnerId)}
                                        >
                                            <div className="admin-chat-avatar">
                                                {conv.partnerAvatar ? (
                                                    <img src={conv.partnerAvatar} alt={conv.partnerName} />
                                                ) : (
                                                    (conv.partnerName || '?').charAt(0).toUpperCase()
                                                )}
                                                {conv.isOnline && <span className="admin-chat-online-status"></span>}
                                            </div>
                                            <div className="admin-chat-info">
                                                <div className="admin-chat-info-top">
                                                    <span className="admin-chat-partner-name">{conv.partnerName}</span>
                                                    <span className="admin-chat-time">
                                                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                    </span>
                                                </div>
                                                <p className="admin-chat-last-msg">{conv.lastMessage || 'Chưa có tin nhắn'}</p>
                                            </div>
                                            {conv.unreadCount > 0 && <span className="admin-unread-count">{conv.unreadCount}</span>}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>
                                        Không tìm thấy hội thoại
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Main Chat Area */}
                        <div className="admin-chat-main">
                            {!activeChat ? (
                                <div className="admin-chat-empty">
                                    <span className="material-symbols-outlined">forum</span>
                                    <h3>Trò chuyện</h3>
                                    <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                                </div>
                            ) : (
                                <>
                                    <header className="admin-chat-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="admin-chat-avatar small" style={{ width: '40px', height: '40px' }}>
                                                {activePartner?.partnerAvatar ? (
                                                    <img src={activePartner.partnerAvatar} alt={activePartner.partnerName} />
                                                ) : (
                                                    (activePartner?.partnerName || '?').charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '15px' }}>{activePartner?.partnerName}</div>
                                                <div style={{ fontSize: '12px', color: '#48bb78', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48bb78' }}></span>
                                                    Đang hoạt động
                                                </div>
                                            </div>
                                        </div>
                                    </header>

                                    <div className="admin-chat-messages custom-scrollbar">
                                        {messages.map((msg, idx) => {
                                            const isMine = msg.senderId !== activeChat;
                                            return (
                                                <div key={msg.id || idx} className={`admin-msg-row ${isMine ? 'mine' : 'theirs'}`}>
                                                    <div className="admin-msg-bubble">
                                                        {msg.content}
                                                    </div>
                                                    <span className="admin-msg-time">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <footer className="admin-chat-footer">
                                        <form className="admin-chat-input-row" onSubmit={handleSend}>
                                            <input 
                                                type="text" 
                                                placeholder="Nhập tin nhắn..." 
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                autoComplete="off"
                                            />
                                            <button 
                                                type="submit" 
                                                className="admin-chat-send-btn" 
                                                disabled={!chatInput.trim() || !isConnected}
                                            >
                                                <span className="material-symbols-outlined">send</span>
                                            </button>
                                        </form>
                                    </footer>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminChat;
