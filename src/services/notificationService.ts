import { apiClient } from '../utils/api';
import type { ApiResponse } from '../utils/api';

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  reference_id?: number;
  reference_type?: string;
  is_read: boolean;
  is_deleted: boolean;
  priority: NotificationPriority;
  action_url?: string;
  metadata?: any;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'order' | 'favorite' | 'cart' | 'promo' | 'system' | 'general';
export type NotificationPriority = 'high' | 'normal' | 'low';

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  high_priority_unread: number;
}

export interface NotificationFilters {
  type?: NotificationType;
  is_read?: boolean;
  is_deleted?: boolean;
  priority?: NotificationPriority;
  limit?: number;
  offset?: number;
}

export interface UpdateNotificationRequest {
  is_read?: boolean;
  is_deleted?: boolean;
}

export interface MarkMultipleRequest {
  notification_ids: number[];
  is_read?: boolean;
  is_deleted?: boolean;
}

export interface NotificationPreference {
  id: number;
  user_id: number;
  notification_type: string;
  enabled: boolean;
  delivery_method: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferenceUpdate {
  notification_type: string;
  enabled: boolean;
  delivery_method?: string;
}

// Notification Service
export class NotificationService {
  // Get notifications with filters
  static async getNotifications(filters?: NotificationFilters): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.is_read !== undefined) params.append('is_read', filters.is_read.toString());
    if (filters?.is_deleted !== undefined) params.append('is_deleted', filters.is_deleted.toString());
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/auth/notifications?${queryString}` : '/api/auth/notifications';
    
    return apiClient.get<Notification[]>(url);
  }

  // Get notification statistics
  static async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    return apiClient.get<NotificationStats>('/notifications/stats');
  }

  // Update single notification
  static async updateNotification(
    notificationId: number, 
    update: UpdateNotificationRequest
  ): Promise<ApiResponse<Notification>> {
    return apiClient.put<Notification>(`/notifications/${notificationId}`, update);
  }

  // Mark notification as read
  static async markAsRead(notificationId: number): Promise<ApiResponse<Notification>> {
    return this.updateNotification(notificationId, { is_read: true });
  }

  // Mark notification as unread
  static async markAsUnread(notificationId: number): Promise<ApiResponse<Notification>> {
    return this.updateNotification(notificationId, { is_read: false });
  }

  // Delete notification (soft delete)
  static async deleteNotification(notificationId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/notifications/${notificationId}`);
  }

  // Mark multiple notifications
  static async markMultiple(request: MarkMultipleRequest): Promise<ApiResponse<{ updated_count: number; message: string }>> {
    return apiClient.put<{ updated_count: number; message: string }>('/notifications/bulk', request);
  }

  // Mark multiple as read
  static async markMultipleAsRead(notificationIds: number[]): Promise<ApiResponse<{ updated_count: number; message: string }>> {
    return this.markMultiple({ notification_ids: notificationIds, is_read: true });
  }

  // Mark multiple as unread
  static async markMultipleAsUnread(notificationIds: number[]): Promise<ApiResponse<{ updated_count: number; message: string }>> {
    return this.markMultiple({ notification_ids: notificationIds, is_read: false });
  }

  // Delete multiple notifications
  static async deleteMultiple(notificationIds: number[]): Promise<ApiResponse<{ updated_count: number; message: string }>> {
    return this.markMultiple({ notification_ids: notificationIds, is_deleted: true });
  }

  // Mark all as read
  static async markAllAsRead(): Promise<ApiResponse<{ updated_count: number; message: string }>> {
    return apiClient.put<{ updated_count: number; message: string }>('/notifications/mark-all-read', {});
  }

  // Get notification preferences
  static async getNotificationPreferences(): Promise<ApiResponse<NotificationPreference[]>> {
    return apiClient.get<NotificationPreference[]>('/notifications/preferences');
  }

  // Update notification preference
  static async updateNotificationPreference(
    preference: NotificationPreferenceUpdate
  ): Promise<ApiResponse<NotificationPreference>> {
    return apiClient.put<NotificationPreference>('/notifications/preferences', preference);
  }

  // Get unread count (quick method)
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getNotificationStats();
      return response.data?.unread_count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  // Get notifications by type
  static async getNotificationsByType(type: NotificationType): Promise<ApiResponse<Notification[]>> {
    return this.getNotifications({ type, is_deleted: false });
  }

  // Get unread notifications
  static async getUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.getNotifications({ is_read: false, is_deleted: false });
  }

  // Get high priority notifications
  static async getHighPriorityNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.getNotifications({ priority: 'high', is_deleted: false });
  }

  // Helper method to format notification time
  static formatNotificationTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Get notification icon based on type
  static getNotificationIcon(type: NotificationType): string {
    const icons = {
      order: '📦',
      favorite: '❤️',
      cart: '🛒',
      promo: '🎉',
      system: '⚙️',
      general: '📢'
    };
    return icons[type] || '📢';
  }

  // Get priority color
  static getPriorityColor(priority: NotificationPriority): string {
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      normal: 'text-blue-600 bg-blue-50 border-blue-200',
      low: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[priority] || colors.normal;
  }
}
