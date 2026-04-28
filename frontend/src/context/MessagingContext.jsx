import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatApi } from '../api';
import toast from 'react-hot-toast';

const MessagingContext = createContext({});

export const MessagingProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [directory, setDirectory] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
    const activeChatRef = useRef(null);
    
    const [user, setUser] = useState(() => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    });

    // Sync user state with localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const userStr = localStorage.getItem('user');
                const parsed = userStr ? JSON.parse(userStr) : null;
                if (JSON.stringify(parsed) !== JSON.stringify(user)) {
                    setUser(parsed);
                }
            } catch (e) {
                setUser(null);
            }
        };

        const interval = setInterval(handleStorageChange, 1000);
        window.addEventListener('storage', handleStorageChange);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [user]);

    const fetchDirectory = useCallback(async () => {
        if (!localStorage.getItem('token')) return;
        setIsLoadingDirectory(true);
        try {
            const res = await chatApi.getDirectory();
            if (res.data.success) {
                setDirectory(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch user directory", err);
        } finally {
            setIsLoadingDirectory(false);
        }
    }, []);

    const getPartnerInfo = useCallback((partnerId) => {
        if (!partnerId) return null;
        let partner = conversations.find(c => c.partnerId === partnerId);
        if (partner) return partner;

        partner = directory.find(u => u.partnerId === partnerId);
        if (partner) return partner;

        return null;
    }, [conversations, directory]);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    const refreshConversations = useCallback(async () => {
        if (!localStorage.getItem('token')) return;
        try {
            const res = await chatApi.getConversations();
            if (res.data?.success) {
                setConversations(res.data.data);
                const totalUnread = res.data.data.filter(c => c.isUnread).length;
                setUnreadCount(totalUnread);
            }
        } catch (err) {}
    }, []);

    const handleIncomingMessage = useCallback((newMsg) => {
        setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
        });
        if (!activeChatRef.current || activeChatRef.current !== newMsg.senderId) {
            toast(`💬 Tin nhắn mới từ ${newMsg.partnerName || 'đối tác'}: ${newMsg.content?.substring(0, 25)}...`);
        }
        refreshConversations();
    }, [refreshConversations]);

    useEffect(() => {
        if (!user?.id) {
            setIsConnected(false);
            setConversations([]);
            setDirectory([]);
            return;
        }

        let client;
        try {
            client = new Client({
                webSocketFactory: () => new SockJS('/ws'),
                reconnectDelay: 5000,
                onConnect: () => {
                    setIsConnected(true);
                    client.subscribe(`/user/${user.id}/queue/messages`, (message) => {
                        try {
                            const newMsg = JSON.parse(message.body);
                            handleIncomingMessage(newMsg);
                        } catch (e) {
                            console.error('Failed to parse incoming message', e);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    setIsConnected(false);
                },
                onDisconnect: () => {
                    setIsConnected(false);
                }
            });

            client.activate();
            setStompClient(client);
        } catch (e) {
            console.error('WebSocket activation failed:', e);
        }

        refreshConversations();
        fetchDirectory();

        return () => {
            if (client) {
                try {
                    client.deactivate();
                } catch (err) {
                    console.error('Error deactivating client:', err);
                }
            }
        };
    }, [user?.id, refreshConversations, fetchDirectory]);

    const sendMessage = async (partnerId, content) => {
        if (!content.trim()) return false;
        try {
            const res = await chatApi.sendMessage(partnerId, { content });
            if (res.data?.success) {
                const sentMsg = res.data.data;
                setMessages((prev) => [...prev, sentMsg]);
                refreshConversations();
                return true;
            }
            return false;
        } catch (err) {
            toast.error("Không thể gửi tin nhắn");
            return false;
        }
    };

    const loadMessages = async (partnerId) => {
        setActiveChat(partnerId);
        try {
            const res = await chatApi.getMessages(partnerId);
            if (res.data?.success) {
                setMessages(res.data.data);
                refreshConversations();
            }
        } catch (err) {
            console.error("Failed to load message history", err);
        }
    };

    return (
        <MessagingContext.Provider value={{
            isConnected,
            conversations,
            directory,
            messages,
            activeChat,
            unreadCount,
            sendMessage,
            loadMessages,
            setActiveChat,
            refreshConversations,
            fetchDirectory,
            getPartnerInfo,
            isChatOpen,
            setIsChatOpen,
            stompClient
        }}>
            {children}
        </MessagingContext.Provider>
    );
};

export const useMessaging = () => {
    const context = useContext(MessagingContext);
    if (!context || Object.keys(context).length === 0) {
        return {
            isConnected: false,
            conversations: [],
            directory: [],
            messages: [],
            activeChat: null,
            unreadCount: 0,
            isChatOpen: false,
            setIsChatOpen: () => {},
            sendMessage: () => {},
            loadMessages: () => {},
            setActiveChat: () => {},
            refreshConversations: () => {},
            fetchDirectory: () => {},
            getPartnerInfo: () => null
        };
    }
    return context;
};
