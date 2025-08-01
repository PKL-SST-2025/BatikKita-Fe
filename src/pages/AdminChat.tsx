import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

interface AdminChatStats {
  total_rooms: number;
  active_rooms: number;
  total_messages: number;
  unread_messages: number;
}

export default function AdminChat() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = createSignal<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = createSignal<ChatRoom | null>(null);
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [stats, setStats] = createSignal<AdminChatStats>({
    total_rooms: 0,
    active_rooms: 0,
    total_messages: 0,
    unread_messages: 0
  });

  let messagesContainer: HTMLDivElement | undefined;
  let websocket: WebSocket | undefined;

  // Format waktu
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
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

  // Load chat rooms
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
        
        // Update stats
        const totalRooms = data.data?.length || 0;
        const activeRooms = data.data?.filter((room: ChatRoom) => room.last_message).length || 0;
        const unreadMessages = data.data?.reduce((sum: number, room: ChatRoom) => sum + room.unread_count, 0) || 0;
        
        setStats({
          total_rooms: totalRooms,
          active_rooms: activeRooms,
          total_messages: 0, // Will be updated when we get messages
          unread_messages: unreadMessages
        });
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
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
      console.error('Error sending message:', error);
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
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Select room
  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    loadMessages(room.id);
  };

  // WebSocket connection
  const connectWebSocket = () => {
    websocket = new WebSocket('ws://localhost:8080/ws/chat');
    
    websocket.onopen = () => {
      console.log('💬 Admin WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'user_message' && selectedRoom()?.id === data.room_id) {
          // Add new user message to current chat
          const newMsg: ChatMessage = {
            id: Date.now(),
            room_id: data.room_id,
            sender_id: data.sender_id,
            sender_name: data.sender_name,
            sender_role: 'user',
            message: data.message,
            timestamp: data.timestamp,
            is_read: false
          };
          setMessages(prev => [...prev, newMsg]);
          setTimeout(scrollToBottom, 100);
        }
        
        // Refresh rooms when new message arrives
        loadChatRooms();
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

  // Check if user is admin
  if (!user() || user()?.role !== 'admin') {
    return (
      <div class="min-h-screen bg-gray-100">
        <Navbar />
        <div class="container mx-auto px-4 py-8">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p class="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      
      <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Chat Dashboard</h1>
          <p class="text-gray-600">Kelola percakapan dengan pelanggan</p>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Rooms</p>
                <p class="text-2xl font-bold text-gray-900">{stats().total_rooms}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Active Rooms</p>
                <p class="text-2xl font-bold text-gray-900">{stats().active_rooms}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Messages</p>
                <p class="text-2xl font-bold text-gray-900">{messages().length}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-red-100 text-red-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Unread</p>
                <p class="text-2xl font-bold text-gray-900">{stats().unread_messages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="flex h-96">
            {/* Chat Rooms List */}
            <div class="w-1/3 border-r border-gray-200">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">Chat Rooms</h3>
                <p class="text-sm text-gray-500">Pilih room untuk membalas</p>
              </div>
              
              <div class="overflow-y-auto h-80">
                <Show
                  when={chatRooms().length > 0}
                  fallback={
                    <div class="p-4 text-center text-gray-500">
                      <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p class="text-sm">Belum ada chat room</p>
                    </div>
                  }
                >
                  <For each={chatRooms()}>
                    {(room) => (
                      <div
                        onClick={() => selectRoom(room)}
                        class={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedRoom()?.id === room.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div class="flex items-center justify-between mb-2">
                          <h4 class="font-medium text-gray-800">{room.name}</h4>
                          <Show when={room.unread_count > 0}>
                            <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                              {room.unread_count}
                            </span>
                          </Show>
                        </div>
                        <Show when={room.last_message}>
                          <p class="text-sm text-gray-600 truncate mb-1">{room.last_message}</p>
                          <p class="text-xs text-gray-400">
                            {room.last_message_time ? formatTime(room.last_message_time) : ''}
                          </p>
                        </Show>
                        <Show when={!room.last_message}>
                          <p class="text-sm text-gray-400 italic">Belum ada pesan</p>
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
                      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>Pilih chat room untuk melihat pesan</p>
                    </div>
                  </div>
                }
              >
                {/* Chat Header */}
                <div class="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 class="font-semibold text-gray-800">{selectedRoom()?.name}</h3>
                  <p class="text-sm text-gray-500">User ID: {selectedRoom()?.user_id}</p>
                </div>

                {/* Messages */}
                <div ref={messagesContainer} class="flex-1 overflow-y-auto p-4 space-y-4">
                  <Show
                    when={!isLoading() && messages().length > 0}
                    fallback={
                      <div class="text-center text-gray-500">
                        <Show
                          when={!isLoading()}
                          fallback={
                            <div class="flex items-center justify-center">
                              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              <span class="ml-2">Memuat pesan...</span>
                            </div>
                          }
                        >
                          <p>Belum ada pesan dalam chat ini</p>
                        </Show>
                      </div>
                    }
                  >
                    <For each={messages()}>
                      {(message) => (
                        <div class={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div class={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_role === 'admin'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            <Show when={message.sender_role !== 'admin'}>
                              <p class="text-xs font-medium mb-1 text-blue-600">{message.sender_name}</p>
                            </Show>
                            <p class="whitespace-pre-wrap">{message.message}</p>
                            <p class={`text-xs mt-1 ${
                              message.sender_role === 'admin' ? 'text-blue-100' : 'text-gray-500'
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
                <div class="p-4 border-t border-gray-200">
                  <div class="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage()}
                      onInput={(e) => setNewMessage(e.currentTarget.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ketik balasan Anda..."
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!selectedRoom()}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage().trim() || !selectedRoom()}
                      class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
