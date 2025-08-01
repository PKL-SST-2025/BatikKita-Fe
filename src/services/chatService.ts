export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'user' | 'admin' | 'support';
  message: string;
  timestamp: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
}

export interface ChatRoom {
  id: string;
  user_id: string;
  user_name: string;
  status: 'active' | 'closed' | 'waiting';
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatStats {
  total_rooms: number;
  active_rooms: number;
  waiting_rooms: number;
  closed_rooms: number;
  total_messages: number;
  unread_messages: number;
}

class ChatService {
  private baseUrl = 'http://localhost:8080/api';

  // Get chat rooms (for admin)
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/rooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      return [];
    }
  }

  // Get messages for a chat room
  async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/rooms/${roomId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }

  // Send a message
  async sendMessage(roomId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<ChatMessage | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          message_type: messageType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Create or get user chat room
  async getOrCreateUserRoom(): Promise<ChatRoom | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/user-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting/creating user room:', error);
      return null;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(roomId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/rooms/${roomId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  // Get chat stats (for admin)
  async getChatStats(): Promise<ChatStats> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || {
        total_rooms: 0,
        active_rooms: 0,
        waiting_rooms: 0,
        closed_rooms: 0,
        total_messages: 0,
        unread_messages: 0
      };
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      return {
        total_rooms: 0,
        active_rooms: 0,
        waiting_rooms: 0,
        closed_rooms: 0,
        total_messages: 0,
        unread_messages: 0
      };
    }
  }

  // Format time for display
  formatMessageTime(timestamp: string): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Baru saja';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam yang lalu`;
    } else {
      return messageTime.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // Get message status icon
  getMessageStatusIcon(isRead: boolean): string {
    return isRead ? '✓✓' : '✓';
  }

  // Get chat room status color
  getRoomStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  // Get chat room status text
  getRoomStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'waiting':
        return 'Menunggu';
      case 'closed':
        return 'Ditutup';
      default:
        return 'Tidak Diketahui';
    }
  }
}

export default new ChatService();
