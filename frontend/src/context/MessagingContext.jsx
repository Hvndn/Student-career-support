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
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const activeChatRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));

    // Sync activeChatRef with state to avoid stale closures in listeners
    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    const refreshConversations = useCallback(async () => {
        try {
            const res = await chatApi.getConversations();
            if (res.data?.success) {
                setConversations(res.data.data);
                const totalUnread = res.data.data.filter(c => c.isUnread).length;
                setUnreadCount(totalUnread);
            }
        } catch (err) {
            // Silently fail connection check
        }
    }, []);

    const handleIncomingMessage = useCallback((newMsg) => {
        setMessages((prev) => {
            // Check if message ID already exists to avoid duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
        });

        // Show notification if sender is not the one user is currently talking to
        if (!activeChatRef.current || activeChatRef.current !== newMsg.senderId) {
            toast(`💬 Tin nhắn mới từ ${newMsg.partnerName || 'đối tác'}: ${newMsg.content?.substring(0, 25)}...`);
        }
        
        refreshConversations();
    }, [refreshConversations]);

    // WebSocket Initialization
    useEffect(() => {
        if (!user?.id) return;

        let client;
        try {
            client = new Client({
                webSocketFactory: () => new SockJS('/ws'),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    setIsConnected(true);
                    // Subscribe to the private message queue for the current user
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

        return () => {
            if (client) {
                try {
                    client.deactivate();
                } catch (err) {
                    console.error('Error deactivating client:', err);
                }
            }
        };
    }, [user?.id]); // Only re-run if user ID changes

    const sendMessage = async (partnerId, content) => {
        if (!content.trim()) return false;
        try {
            const res = await chatApi.sendMessage(partnerId, { content });
            if (res.data?.success) {
                const sentMsg = res.data.data;
                // Add your own sent message to state immediately for immediate feedback
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
        try {
            const res = await chatApi.getMessages(partnerId);
            if (res.data?.success) {
                setMessages(res.data.data);
                setActiveChat(partnerId);
                // Refresh list to update unread status indicators
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
            messages,
            activeChat,
            unreadCount,
            sendMessage,
            loadMessages,
            setActiveChat,
            refreshConversations,
            isChatOpen,
            setIsChatOpen,
            stompClient // Exported just in case though currently managed internally
        }}>
            {children}
        </MessagingContext.Provider>
    );
};

export const useMessaging = () => {
    const context = useContext(MessagingContext);
    if (!context || Object.keys(context).length === 0) {
        // Fallback object to prevent crashes
        return {
            isConnected: false,
            conversations: [],
            messages: [],
            unreadCount: 0,
            isChatOpen: false,
            setIsChatOpen: () => {},
            sendMessage: () => {},
            loadMessages: () => {},
            setActiveChat: () => {},
            refreshConversations: () => {}
        };
    }
    return context;
};
