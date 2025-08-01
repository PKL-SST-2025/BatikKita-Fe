import { createContext, useContext, createSignal, createEffect, onCleanup } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { NotificationService, type Notification, type NotificationStats } from "../services/notificationService";
import { useAuth } from "./AuthContext";

export interface NotificationContextValue {
  notifications: () => Notification[];
  stats: () => NotificationStats | null;
  loading: () => boolean;
  error: () => string | null;
  
  // Actions
  loadNotifications: () => Promise<void>;
  loadStats: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAsUnread: (notificationId: number) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markMultipleAsRead: (notificationIds: number[]) => Promise<void>;
  deleteMultiple: (notificationIds: number[]) => Promise<void>;
  
  // Real-time
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  
  // Getters
  unreadCount: () => number;
  unreadNotifications: () => Notification[];
  highPriorityUnread: () => Notification[];
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider(props: { children: JSX.Element }) {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [notifications, setNotifications] = createSignal<Notification[]>([]);
  const [stats, setStats] = createSignal<NotificationStats | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  
  // WebSocket connection
  let websocket: WebSocket | null = null;
  let reconnectTimeout: number | null = null;
  let heartbeatInterval: number | null = null;

  // Load notifications
  const loadNotifications = async () => {
    if (!isAuthenticated()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await NotificationService.getNotifications({
        is_deleted: false,
        limit: 50
      });
      
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message || 'Failed to load notifications');
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    if (!isAuthenticated()) return;
    
    try {
      const response = await NotificationService.getNotificationStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load notification stats:', err);
    }
  };

  // Mark as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await NotificationService.markAsRead(notificationId);
      
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true, updated_at: new Date().toISOString() }
              : notif
          )
        );
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          unread_count: Math.max(0, prev.unread_count - 1),
          high_priority_unread: notifications().find(n => n.id === notificationId && n.priority === 'high') 
            ? Math.max(0, prev.high_priority_unread - 1)
            : prev.high_priority_unread
        } : null);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Mark as unread
  const markAsUnread = async (notificationId: number) => {
    try {
      const response = await NotificationService.markAsUnread(notificationId);
      
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: false, updated_at: new Date().toISOString() }
              : notif
          )
        );
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          unread_count: prev.unread_count + 1,
          high_priority_unread: notifications().find(n => n.id === notificationId && n.priority === 'high') 
            ? prev.high_priority_unread + 1
            : prev.high_priority_unread
        } : null);
      }
    } catch (err) {
      console.error('Failed to mark notification as unread:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await NotificationService.deleteNotification(notificationId);
      
      if (response.success) {
        const deletedNotif = notifications().find(n => n.id === notificationId);
        
        // Remove from local state
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        
        // Update stats
        setStats(prev => prev ? {
          total_count: Math.max(0, prev.total_count - 1),
          unread_count: deletedNotif && !deletedNotif.is_read 
            ? Math.max(0, prev.unread_count - 1) 
            : prev.unread_count,
          high_priority_unread: deletedNotif && !deletedNotif.is_read && deletedNotif.priority === 'high'
            ? Math.max(0, prev.high_priority_unread - 1)
            : prev.high_priority_unread
        } : null);
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await NotificationService.markAllAsRead();
      
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true, updated_at: new Date().toISOString() }))
        );
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          unread_count: 0,
          high_priority_unread: 0
        } : null);
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  // Mark multiple as read
  const markMultipleAsRead = async (notificationIds: number[]) => {
    try {
      const response = await NotificationService.markMultipleAsRead(notificationIds);
      
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif.id)
              ? { ...notif, is_read: true, updated_at: new Date().toISOString() }
              : notif
          )
        );
        
        // Recalculate stats
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to mark multiple notifications as read:', err);
    }
  };

  // Delete multiple
  const deleteMultiple = async (notificationIds: number[]) => {
    try {
      const response = await NotificationService.deleteMultiple(notificationIds);
      
      if (response.success) {
        // Remove from local state
        setNotifications(prev => prev.filter(notif => !notificationIds.includes(notif.id)));
        
        // Recalculate stats
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to delete multiple notifications:', err);
    }
  };

  // WebSocket connection
  const connectWebSocket = () => {
    if (!isAuthenticated() || websocket) return;

    try {
      // In production, this would be wss://your-domain/ws/notifications
      websocket = new WebSocket('ws://localhost:8080/ws/notifications');
      
      websocket.onopen = () => {
        console.log('🔗 Notification WebSocket connected');
        
        // Send authentication
        if (user()?.id) {
          websocket?.send(JSON.stringify({
            type: 'auth',
            user_id: user()!.id
          }));
        }
        
        // Start heartbeat
        heartbeatInterval = setInterval(() => {
          if (websocket?.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };
      
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'new_notification':
              // Add new notification to the beginning of the list
              setNotifications(prev => [data.notification, ...prev]);
              setStats(prev => prev ? {
                total_count: prev.total_count + 1,
                unread_count: prev.unread_count + 1,
                high_priority_unread: data.notification.priority === 'high' 
                  ? prev.high_priority_unread + 1 
                  : prev.high_priority_unread
              } : null);
              break;
              
            case 'notification_updated':
              // Update existing notification
              setNotifications(prev => 
                prev.map(notif => 
                  notif.id === data.notification.id ? data.notification : notif
                )
              );
              break;
              
            case 'stats_updated':
              setStats(data.stats);
              break;
              
            case 'pong':
              // Heartbeat response
              break;
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
      
      websocket.onerror = (error) => {
        console.error('❌ Notification WebSocket error:', error);
      };
      
      websocket.onclose = () => {
        console.log('🔌 Notification WebSocket disconnected');
        websocket = null;
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        
        // Attempt to reconnect after 5 seconds if user is still authenticated
        if (isAuthenticated()) {
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        }
      };
      
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (websocket) {
      websocket.close();
      websocket = null;
    }
    
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  // Computed values
  const unreadCount = () => stats()?.unread_count || 0;
  
  const unreadNotifications = () => 
    notifications().filter(notif => !notif.is_read);
  
  const highPriorityUnread = () => 
    notifications().filter(notif => !notif.is_read && notif.priority === 'high');

  // Effects
  createEffect(() => {
    if (isAuthenticated()) {
      loadNotifications();
      loadStats();
      connectWebSocket();
    } else {
      setNotifications([]);
      setStats(null);
      disconnectWebSocket();
    }
  });

  // Cleanup on component unmount
  onCleanup(() => {
    disconnectWebSocket();
  });

  // Auto-refresh every 5 minutes when page is visible
  createEffect(() => {
    if (!isAuthenticated()) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadStats();
      }
    }, 5 * 60 * 1000);

    onCleanup(() => clearInterval(interval));
  });

  const contextValue: NotificationContextValue = {
    notifications,
    stats,
    loading,
    error,
    loadNotifications,
    loadStats,
    markAsRead,
    markAsUnread,
    deleteNotification,
    markAllAsRead,
    markMultipleAsRead,
    deleteMultiple,
    connectWebSocket,
    disconnectWebSocket,
    unreadCount,
    unreadNotifications,
    highPriorityUnread
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
