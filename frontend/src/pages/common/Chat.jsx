import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';
import '../../assets/css/common/Chat.css';

const Chat = () => {
    const [searchParams] = useSearchParams();
    const partnerIdParam = searchParams.get('partnerId');

    const { 
        messages, 
        activeChat, 
        sendMessage, 
        loadMessages, 
        conversations,
        isConnected 
    } = useMessaging();

    useEffect(() => {
        if (partnerIdParam) {
            loadMessages(parseInt(partnerIdParam));
        }
    }, [partnerIdParam]);

    const [chatInput, setChatInput] = useState('');
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

    const activePartner = conversations.find(c => c.partnerId === activeChat);

    return (
        <div className="dau-chat-page-wrapper">
            <div className="dau-chat-container single-column">
                <div className="dau-chat-main">
                    {!activeChat ? (
                        <div className="dau-chat-empty-state">
                            <div className="chat-empty-icon">
                                <span className="material-symbols-outlined" style={{fontSize: '64px', color: '#bb2649'}}>chat_bubble</span>
                            </div>
                            <h3>Bắt đầu cuộc trò chuyện</h3>
                            <p>Chọn một người liên hệ từ thanh bên trái để bắt đầu nhắn tin nhanh.</p>
                        </div>
                    ) : (
                        <>
                            <div className="chat-main-header">
                                <div className="chat-partner-summary">
                                    <div className="chat-avatar placeholder small">
                                        {activePartner?.partnerAvatar ? (
                                            <img src={activePartner.partnerAvatar} alt={activePartner.partnerName} />
                                        ) : (
                                            activePartner?.partnerName?.charAt(0)?.toUpperCase() || '?'
                                        )}
                                    </div>
                                    <div>
                                        <div className="chat-header-name">{activePartner?.partnerName || 'Đang tải...'}</div>
                                        <div className="chat-header-status">
                                            {isConnected ? (
                                                <><span className="status-dot online"></span> Đang hoạt động</>
                                            ) : (
                                                <><span className="status-dot offline"></span> Đang kết nối...</>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-main-body premium-scroll">
                                {messages.length > 0 ? (
                                    messages.map((msg, idx) => {
                                        const isMine = msg.senderId !== activeChat; // Simple check if context logic doesn't flag it
                                        return (
                                            <div key={msg.id || idx} className={`chat-message-row ${isMine ? 'mine' : 'theirs'}`}>
                                                <div className="chat-message-bubble">
                                                    {msg.content}
                                                    <span className="msg-time-small">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="chat-empty-list" style={{marginTop:'auto'}}>Hãy gửi tin nhắn đầu tiên!</div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-main-footer">
                                <form className="chat-input-wrapper" onSubmit={handleSend}>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập tin nhắn..." 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <button type="submit" className="chat-send-btn" disabled={!chatInput.trim() || !isConnected}>
                                        <span className="material-symbols-outlined">send</span>
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
