import { createContext, useContext, createSignal, createEffect, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import ChatService, { type ChatMessage, type ChatRoom, type ChatStats } from "../services/chatService";

interface ChatContextType {
  // Chat rooms state
  chatRooms: () => ChatRoom[];
  currentRoom: () => ChatRoom | null;
  
  // Messages state
  messages: () => ChatMessage[];
  
  // UI state
  isChatOpen: () => boolean;
  isLoading: () => boolean;
  
  // Stats
  chatStats: () => ChatStats;
  unreadCount: () => number;
  
  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  selectRoom: (room: ChatRoom) => void;
  sendMessage: (message: string) => Promise<void>;
  loadChatRooms: () => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;
  createUserRoom: () => Promise<void>;
  markAsRead: (roomId: string) => Promise<void>;
  
  // WebSocket
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

const ChatContext = createContext<ChatContextType>();

export function ChatProvider(props: { children: JSX.Element }) {
  // State signals
  const [chatRooms, setChatRooms] = createSignal<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = createSignal<ChatRoom | null>(null);
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [chatStats, setChatStats] = createSignal<ChatStats>({
    total_rooms: 0,
    active_rooms: 0,
    waiting_rooms: 0,
    closed_rooms: 0,
    total_messages: 0,
    unread_messages: 0
  });
  
  // WebSocket connection
  let websocket: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  
  // Computed values
  const unreadCount = () => {
    return chatRooms().reduce((total, room) => total + room.unread_count, 0);
  };

  // Chat actions
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(!isChatOpen());

  // Load chat rooms
  const loadChatRooms = async () => {
    try {
      setIsLoading(true);
      const rooms = await ChatService.getChatRooms();
      setChatRooms(rooms);
      
      // Load chat stats
      const stats = await ChatService.getChatStats();
      setChatStats(stats);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a room
  const loadMessages = async (roomId: string) => {
    try {
      setIsLoading(true);
      const roomMessages = await ChatService.getChatMessages(roomId);
      setMessages(roomMessages);
      
      // Mark messages as read
      await markAsRead(roomId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a chat room
  const selectRoom = async (room: ChatRoom) => {
    setCurrentRoom(room);
    await loadMessages(room.id);
  };

  // Create user room for customer
  const createUserRoom = async () => {
    try {
      setIsLoading(true);
      const room = await ChatService.getOrCreateUserRoom();
      if (room) {
        setCurrentRoom(room);
        await loadMessages(room.id);
        setIsChatOpen(true);
      }
    } catch (error) {
      console.error('Failed to create user room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async (message: string) => {
    const room = currentRoom();
    if (!room || !message.trim()) return;

    try {
      const newMessage = await ChatService.sendMessage(room.id, message.trim());
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        
        // Send via WebSocket for real-time update
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'user_message',
            room_id: room.id,
            message: message.trim(),
            sender_id: newMessage.sender_id,
            sender_name: newMessage.sender_name,
            timestamp: newMessage.timestamp
          }));
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Mark messages as read
  const markAsRead = async (roomId: string) => {
    try {
      const success = await ChatService.markMessagesAsRead(roomId);
      if (success) {
        // Update room unread count
        setChatRooms(prev => prev.map(room => 
          room.id === roomId ? { ...room, unread_count: 0 } : room
        ));
        
        // Update messages as read
        setMessages(prev => prev.map(msg => ({ ...msg, is_read: true })));
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  // WebSocket connection
  const connectWebSocket = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      websocket = new WebSocket(`ws://localhost:8080/ws/chat?token=${token}`);
      
      websocket.onopen = () => {
        console.log('💬 Chat WebSocket connected');
        reconnectAttempts = 0;
        
        // Send auth info
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'auth',
            user_id: 1, // Get from auth context
            role: 'user'
          }));
        }
      };
      
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Chat WebSocket message:', data);
          
          switch (data.type) {
            case 'admin_message':
              // Add admin message to current chat
              if (currentRoom()?.id === data.room_id) {
                const adminMessage: ChatMessage = {
                  id: Date.now().toString(),
                  sender_id: data.sender_id.toString(),
                  sender_name: data.sender_name,
                  sender_role: data.sender_role,
                  message: data.message,
                  timestamp: data.timestamp,
                  is_read: false,
                  message_type: 'text'
                };
                setMessages(prev => [...prev, adminMessage]);
              }
              break;
            case 'message':
              // Add new message to current room
              if (data.room_id === currentRoom()?.id) {
                setMessages(prev => [...prev, data.message]);
              }
              
              // Update room's last message and unread count
              setChatRooms(prev => prev.map(room => 
                room.id === data.room_id 
                  ? { 
                      ...room, 
                      last_message: data.message.message,
                      last_message_time: data.message.timestamp,
                      unread_count: room.id === currentRoom()?.id ? room.unread_count : room.unread_count + 1
                    }
                  : room
              ));
              break;
            case 'auth_success':
              console.log('💬 WebSocket authenticated successfully');
              break;
              
            case 'room_update':
              // Update room status
              setChatRooms(prev => prev.map(room => 
                room.id === data.room_id ? { ...room, ...data.updates } : room
              ));
              break;
              
            case 'stats_update':
              setChatStats(data.stats);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      websocket.onerror = (error) => {
        console.error('❌ Chat WebSocket error:', error);
      };
      
      websocket.onclose = () => {
        console.log('🔌 Chat WebSocket disconnected');
        websocket = null;
        
        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`🔄 Attempting to reconnect chat WebSocket in ${delay}ms...`);
          setTimeout(connectWebSocket, delay);
        }
      };
    } catch (error) {
      console.error('Failed to connect chat WebSocket:', error);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (websocket) {
      websocket.close();
      websocket = null;
    }
  };

  // Initialize chat on mount
  createEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadChatRooms();
      connectWebSocket();
    }
  });

  // Cleanup on unmount
  onCleanup(() => {
    disconnectWebSocket();
  });

  const contextValue: ChatContextType = {
    // State
    chatRooms,
    currentRoom,
    messages,
    isChatOpen,
    isLoading,
    chatStats,
    unreadCount,
    
    // Actions
    openChat,
    closeChat,
    toggleChat,
    selectRoom,
    sendMessage,
    loadChatRooms,
    loadMessages,
    createUserRoom,
    markAsRead,
    
    // WebSocket
    connectWebSocket,
    disconnectWebSocket
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {props.children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
