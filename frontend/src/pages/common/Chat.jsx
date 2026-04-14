import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatApi, authApi } from '../../api';
import '../../assets/css/common/Chat.css';
import toast from 'react-hot-toast';

const Chat = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activePartnerId = searchParams.get('partnerId') 
                            ? parseInt(searchParams.get('partnerId')) 
                            : null;

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const messagesEndRef = useRef(null);
    const activeChatRef = useRef(activePartnerId);
    activeChatRef.current = activePartnerId;

    // Lấy thông tin user hiện tại
    useEffect(() => {
        authApi.getCurrentUser()
            .then(res => {
                if (res.data?.success) {
                    setCurrentUser(res.data.data);
                }
            })
            .catch(console.error);
    }, []);

    // Load danh sách conversation ban đầu & polling
    const fetchConversations = async () => {
        try {
            const res = await chatApi.getConversations();
            if (res.data?.success) {
                setConversations(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingConversations(false);
        }
    };

    // Load message history với đối tác hiện tại & polling
    const fetchMessages = async (partnerId, isInterval = false) => {
        if (!isInterval) setLoadingMessages(true);
        try {
            const res = await chatApi.getMessages(partnerId);
            if (res.data?.success) {
                setMessages(res.data.data);
                // Chỉ tự động cuộn xuống dưới khi fetch lần đầu (không phải polling)
                if (!isInterval) {
                    setTimeout(scrollToBottom, 100);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        const pollConv = setInterval(fetchConversations, 5000);
        return () => clearInterval(pollConv);
    }, []);

    useEffect(() => {
        if (activePartnerId) {
            const id = parseInt(activePartnerId);
            fetchMessages(id);
            const pollMsgs = setInterval(() => {
                if (activeChatRef.current === id) {
                    fetchMessages(id, true);
                }
            }, 3000);
            return () => clearInterval(pollMsgs);
        } else {
            setMessages([]);
        }
    }, [activePartnerId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !activePartnerId) return;

        const currentInput = chatInput;
        setChatInput(''); // Optimistic clear

        try {
            const res = await chatApi.sendMessage(activePartnerId, { content: currentInput });
            if (res.data?.success) {
                setMessages(prev => [...prev, res.data.data]);
                setTimeout(scrollToBottom, 100);
                fetchConversations(); // Update list immediately
            }
        } catch (err) {
            toast.error("Không gửi được tin nhắn");
            setChatInput(currentInput); // rollback
        }
    };

    const selectConversation = (partnerId) => {
        setSearchParams({ partnerId });
    };

    const activePartner = conversations.find(c => c.partnerId === activePartnerId);

    const filteredConversations = conversations.filter(c => 
        (c.partnerName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dau-chat-page-wrapper">
            <h2 className="dau-chat-main-title">Trò chuyện</h2>
            
            <div className="dau-chat-container">
                {/* ── LEFT PANEL: CONVERSATIONS ── */}
                <div className="dau-chat-sidebar">
                    <div className="dau-chat-search">
                        <svg className="chat-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm tin nhắn hoặc người dùng..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="dau-chat-list premium-scroll">
                        {loadingConversations ? (
                            <div className="chat-loading-text">Đang tải cuộc trò chuyện...</div>
                        ) : filteredConversations.length > 0 ? (
                            filteredConversations.map(conv => (
                                <div 
                                    key={conv.partnerId} 
                                    className={`dau-chat-item ${activePartnerId === conv.partnerId ? 'active' : ''}`}
                                    onClick={() => selectConversation(conv.partnerId)}
                                >
                                    <div className="chat-avatar-wrapper">
                                        {conv.partnerAvatar ? (
                                            <img src={`/api${conv.partnerAvatar}`} alt={conv.partnerName} className="chat-avatar" />
                                        ) : (
                                            <div className="chat-avatar placeholder">
                                                {conv.partnerName ? conv.partnerName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                        )}
                                        <span className="online-indicator"></span>
                                    </div>
                                    <div className="chat-item-info">
                                        <div className="chat-item-header">
                                            <span className="chat-partner-name">{conv.partnerName}</span>
                                        </div>
                                        <div className="chat-item-lastmsg">
                                            {conv.lastMessage || 'Bắt đầu trò chuyện'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="chat-empty-list">Không có cuộc trò chuyện nào</div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT PANEL: MAIN CHAT ── */}
                <div className="dau-chat-main">
                    {!activePartnerId ? (
                        <div className="dau-chat-empty-state">
                            <div className="chat-empty-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b1538" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                        </div>
                    ) : (
                        <>
                            <div className="chat-main-header">
                                <div className="chat-partner-summary">
                                    <div className="chat-avatar placeholder small">
                                        {activePartner?.partnerName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div className="chat-header-name">{activePartner?.partnerName || 'Đang tải...'}</div>
                                        <div className="chat-header-status">Đang hoạt động</div>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-main-body premium-scroll">
                                {loadingMessages ? (
                                    <div className="chat-loading-text">Đang tải tin nhắn...</div>
                                ) : messages.length > 0 ? (
                                    messages.map((msg, idx) => {
                                        const isMine = msg.isMine;
                                        return (
                                            <div key={msg.id || idx} className={`chat-message-row ${isMine ? 'mine' : 'theirs'}`}>
                                                <div className="chat-message-bubble">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="chat-empty-list" style={{marginTop:'auto'}}>Hãy bắt đầu cuộc trò chuyện!</div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-main-footer">
                                <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập tin nhắn..." 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                    />
                                    <button type="submit" className="chat-send-btn" disabled={!chatInput.trim()}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
