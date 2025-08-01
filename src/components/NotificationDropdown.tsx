import { createSignal, Show, For, onMount, onCleanup } from "solid-js";
import { useNotifications } from "../store/NotificationContext";
import { useNavigate } from "@solidjs/router";
import { NotificationService, type Notification } from "../services/notificationService";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const {
    notifications,
    stats,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = createSignal(false);
  const [selectedNotifications, setSelectedNotifications] = createSignal<number[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = createSignal(false);

  let dropdownRef: HTMLDivElement | undefined;

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen());
    if (!isOpen()) {
      setSelectedNotifications([]);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.action_url) {
      navigate(notification.action_url);
      setIsOpen(false);
    }
  };

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId: number, event: Event) => {
    event.stopPropagation();
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all visible notifications
  const selectAllVisible = () => {
    const visibleNotifications = getFilteredNotifications();
    const allSelected = visibleNotifications.every(notif => 
      selectedNotifications().includes(notif.id)
    );

    if (allSelected) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(visibleNotifications.map(notif => notif.id));
    }
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    const allNotifications = notifications();
    return showUnreadOnly() 
      ? allNotifications.filter(notif => !notif.is_read)
      : allNotifications;
  };

  // Handle bulk actions
  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications().length === 0) return;
    
    for (const notifId of selectedNotifications()) {
      await markAsRead(notifId);
    }
    setSelectedNotifications([]);
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications().length === 0) return;
    
    for (const notifId of selectedNotifications()) {
      await deleteNotification(notifId);
    }
    setSelectedNotifications([]);
  };

  // Get notification type color
  const getTypeColor = (type: string) => {
    const colors = {
      order: 'bg-blue-100 text-blue-800',
      favorite: 'bg-red-100 text-red-800',
      cart: 'bg-green-100 text-green-800',
      promo: 'bg-purple-100 text-purple-800',
      system: 'bg-gray-100 text-gray-800',
      general: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  // Get priority indicator
  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div class="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'normal':
        return <div class="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'low':
        return <div class="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return null;
    }
  };

  return (
    <div class="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        class="relative text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200 p-1"
        title="Notifications"
      >
        <svg 
          class="w-5 h-5 md:w-6 md:h-6" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" 
          />
        </svg>
        
        {/* Unread Badge */}
        <Show when={unreadCount() > 0}>
          <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold min-w-[16px] transform translate-x-1 -translate-y-1">
            {unreadCount() > 9 ? '9+' : unreadCount()}
          </span>
        </Show>
      </button>

      {/* Dropdown Menu */}
      <Show when={isOpen()}>
        <div class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">Notifikasi</h3>
              <div class="flex items-center space-x-2">
                <Show when={unreadCount() > 0}>
                  <button
                    onClick={markAllAsRead}
                    class="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    title="Tandai semua sebagai dibaca"
                  >
                    Tandai Semua
                  </button>
                </Show>
                <button
                  onClick={() => loadNotifications()}
                  class="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Refresh"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats and Filters */}
            <div class="flex items-center justify-between text-sm text-gray-600">
              <div class="flex items-center space-x-4">
                <span>{stats()?.total_count || 0} total</span>
                <Show when={unreadCount() > 0}>
                  <span class="text-red-600 font-medium">{unreadCount()} belum dibaca</span>
                </Show>
              </div>
              
              <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly()}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    class="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-xs">Belum dibaca</span>
                </label>
              </div>
            </div>

            {/* Bulk Actions */}
            <Show when={selectedNotifications().length > 0}>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <span class="text-sm text-gray-600">
                  {selectedNotifications().length} dipilih
                </span>
                <div class="flex items-center space-x-2">
                  <button
                    onClick={handleBulkMarkAsRead}
                    class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Tandai Dibaca
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={selectAllVisible}
                    class="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Pilih Semua
                  </button>
                </div>
              </div>
            </Show>
          </div>

          {/* Notifications List */}
          <div class="flex-1 overflow-y-auto">
            <Show
              when={!loading() && getFilteredNotifications().length > 0}
              fallback={
                <div class="p-8 text-center text-gray-500">
                  <Show
                    when={!loading()}
                    fallback={
                      <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <span class="ml-2">Memuat notifikasi...</span>
                      </div>
                    }
                  >
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" 
                      />
                    </svg>
                    <p class="text-sm font-medium text-gray-500 mb-1">
                      {showUnreadOnly() ? 'Tidak ada notifikasi yang belum dibaca' : 'Tidak ada notifikasi'}
                    </p>
                    <p class="text-xs text-gray-400">
                      Notifikasi baru akan muncul di sini
                    </p>
                  </Show>
                </div>
              }
            >
              <For each={getFilteredNotifications()}>
                {(notification) => (
                  <div
                    class={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div class="p-4">
                      <div class="flex items-start space-x-3">
                        {/* Selection Checkbox */}
                        <div class="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={selectedNotifications().includes(notification.id)}
                            onChange={(e) => toggleNotificationSelection(notification.id, e)}
                            class="rounded text-purple-600 focus:ring-purple-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Notification Icon */}
                        <div class="flex-shrink-0 mt-1">
                          <div class="text-lg">
                            {NotificationService.getNotificationIcon(notification.type as any)}
                          </div>
                        </div>

                        {/* Content */}
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between mb-1">
                            <h4 class={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div class="flex items-center space-x-2 ml-2">
                              {getPriorityIndicator(notification.priority)}
                              <span class={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </span>
                            </div>
                          </div>

                          <p class="text-sm text-gray-600 line-clamp-2 mb-2">
                            {notification.message}
                          </p>

                          <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-400">
                              {NotificationService.formatNotificationTime(notification.created_at)}
                            </span>
                            
                            <div class="flex items-center space-x-1">
                              <Show when={!notification.is_read}>
                                <div class="w-2 h-2 bg-blue-500 rounded-full" title="Belum dibaca"></div>
                              </Show>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                class="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                title="Hapus notifikasi"
                              >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </div>

          {/* Footer */}
          <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
              class="w-full text-center text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Lihat Semua Notifikasi
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
