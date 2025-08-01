import { createSignal, Show, For, onMount, onCleanup } from "solid-js";
import { useAuth } from "../store/AuthContext";

interface ChatRoom {
  id: number;
  name: string;
  room_type: string;
  user_id: number;
  created_at: string;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message: string;
  timestamp: string;
  is_read: boolean;
}

export default function AdminChatWidget() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = createSignal<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = createSignal<ChatRoom | null>(null);
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [isChatOpen, setIsChatOpen] = createSignal(false);
  const [unreadCount, setUnreadCount] = createSignal(0);

  let messagesContainer: HTMLDivElement | undefined;
  let websocket: WebSocket | undefined;

  // Format waktu
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'Baru saja';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Auto scroll ke bawah
  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // Load chat rooms untuk admin
  const loadChatRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChatRooms(data.data || []);
        
        // Calculate total unread
        const totalUnread = data.data?.reduce((sum: number, room: ChatRoom) => sum + room.unread_count, 0) || 0;
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error loading admin chat rooms:', error);
    }
  };

  // Load messages for selected room
  const loadMessages = async (roomId: number) => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
        setTimeout(scrollToBottom, 100);
        
        // Mark messages as read
        await markAsRead(roomId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    setIsLoading(false);
  };

  // Send message as admin
  const sendMessage = async () => {
    const room = selectedRoom();
    const messageText = newMessage().trim();
    
    if (!room || !messageText) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/chat/rooms/${room.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: messageText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        setNewMessage("");
        setTimeout(scrollToBottom, 100);
        
        // Send via WebSocket for real-time update
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'admin_message',
            room_id: room.id,
            message: messageText,
            sender_name: 'Customer Support',
            timestamp: new Date().toISOString()
          }));
        }
        
        // Refresh rooms to update last message
        loadChatRooms();
      }
    } catch (error) {
      console.error('Error sending admin message:', error);
    }
  };

  // Mark messages as read
  const markAsRead = async (roomId: number) => {
    try {
      await fetch(`http://localhost:8080/api/chat/rooms/${roomId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update room unread count
      setChatRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, unread_count: 0 } : room
      ));
      
      // Recalculate total unread
      const totalUnread = chatRooms().reduce((sum, room) => 
        room.id === roomId ? sum : sum + room.unread_count, 0
      );
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Select room
  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    loadMessages(room.id);
  };

  // Open/close chat
  const openChat = () => {
    setIsChatOpen(true);
    if (!selectedRoom() && chatRooms().length > 0) {
      selectRoom(chatRooms()[0]);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedRoom(null);
  };

  // WebSocket connection for real-time updates
  const connectWebSocket = () => {
    websocket = new WebSocket('ws://localhost:8080/ws/chat');
    
    websocket.onopen = () => {
      console.log('💬 Admin WebSocket connected');
      // Send admin auth
      websocket?.send(JSON.stringify({
        type: 'auth',
        role: 'admin',
        user_id: user()?.id || 999
      }));
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'user_message') {
          // Add new user message to current chat if same room
          if (selectedRoom()?.id === data.room_id) {
            const newMsg: ChatMessage = {
              id: Date.now(),
              room_id: data.room_id,
              sender_id: data.sender_id,
              sender_name: data.sender_name || 'Customer',
              sender_role: 'user',
              message: data.message,
              timestamp: data.timestamp,
              is_read: false
            };
            setMessages(prev => [...prev, newMsg]);
            setTimeout(scrollToBottom, 100);
          }
          
          // Refresh rooms to update unread count
          loadChatRooms();
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('💬 Admin WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };
  };

  // Handle Enter key
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  onMount(() => {
    loadChatRooms();
    connectWebSocket();
    
    // Refresh rooms every 30 seconds
    const interval = setInterval(loadChatRooms, 30000);
    
    onCleanup(() => {
      clearInterval(interval);
      if (websocket) {
        websocket.close();
      }
    });
  });

  // Only show for admin users
  if (!user() || user()?.role !== 'admin') return null;

  return (
    <>
      {/* Admin Chat Toggle Button */}
      <Show when={!isChatOpen()}>
        <button
          onClick={openChat}
          class="fixed bottom-20 right-6 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
          title="Admin Chat"
        >
          <div class="relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <Show when={unreadCount() > 0}>
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount() > 9 ? '9+' : unreadCount()}
              </span>
            </Show>
            {/* Admin indicator */}
            <span class="absolute -bottom-1 -right-1 bg-white text-orange-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-orange-600">
              A
            </span>
          </div>
        </button>
      </Show>

      {/* Admin Chat Window */}
      <Show when={isChatOpen()}>
        <div class="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div class="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <h3 class="font-semibold text-sm">Admin Chat Panel</h3>
                <p class="text-xs text-orange-100">Customer Support</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              class="text-orange-100 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex flex-1 overflow-hidden">
            {/* Rooms Sidebar */}
            <div class="w-1/3 border-r border-gray-200 flex flex-col">
              <div class="p-2 border-b border-gray-200 bg-gray-50">
                <h4 class="text-xs font-semibold text-gray-700">Active Chats</h4>
              </div>
              
              <div class="flex-1 overflow-y-auto">
                <Show
                  when={chatRooms().length > 0}
                  fallback={
                    <div class="p-3 text-center text-gray-500">
                      <p class="text-xs">No active chats</p>
                    </div>
                  }
                >
                  <For each={chatRooms()}>
                    {(room) => (
                      <div
                        onClick={() => selectRoom(room)}
                        class={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedRoom()?.id === room.id ? 'bg-orange-50 border-orange-200' : ''
                        }`}
                      >
                        <div class="flex items-center justify-between mb-1">
                          <h5 class="text-xs font-medium text-gray-800 truncate">
                            {room.name.replace('Customer Support - ', '')}
                          </h5>
                          <Show when={room.unread_count > 0}>
                            <span class="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                              {room.unread_count}
                            </span>
                          </Show>
                        </div>
                        <Show when={room.last_message}>
                          <p class="text-xs text-gray-600 truncate">{room.last_message}</p>
                          <p class="text-xs text-gray-400 mt-1">
                            {room.last_message_time ? formatTime(room.last_message_time) : ''}
                          </p>
                        </Show>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            </div>

            {/* Chat Messages */}
            <div class="flex-1 flex flex-col">
              <Show
                when={selectedRoom()}
                fallback={
                  <div class="flex-1 flex items-center justify-center text-gray-500">
                    <div class="text-center">
                      <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p class="text-sm">Select a chat</p>
                    </div>
                  </div>
                }
              >
                {/* Messages */}
                <div ref={messagesContainer} class="flex-1 overflow-y-auto p-3 space-y-3">
                  <Show
                    when={!isLoading() && messages().length > 0}
                    fallback={
                      <div class="text-center text-gray-500">
                        <Show
                          when={!isLoading()}
                          fallback={
                            <div class="flex items-center justify-center">
                              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                              <span class="ml-2 text-sm">Loading...</span>
                            </div>
                          }
                        >
                          <p class="text-sm">No messages yet</p>
                        </Show>
                      </div>
                    }
                  >
                    <For each={messages()}>
                      {(message) => (
                        <div class={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div class={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.sender_role === 'admin'
                              ? 'bg-orange-600 text-white rounded-br-none'
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}>
                            <Show when={message.sender_role !== 'admin'}>
                              <p class="text-xs font-medium mb-1 text-gray-600">{message.sender_name}</p>
                            </Show>
                            <p class="whitespace-pre-wrap">{message.message}</p>
                            <p class={`text-xs mt-1 ${
                              message.sender_role === 'admin' ? 'text-orange-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      )}
                    </For>
                  </Show>
                </div>

                {/* Message Input */}
                <div class="p-3 border-t border-gray-200">
                  <div class="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage()}
                      onInput={(e) => setNewMessage(e.currentTarget.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your reply..."
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      disabled={!selectedRoom()}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage().trim() || !selectedRoom()}
                      class="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
