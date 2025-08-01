import { createSignal, Show, For, createEffect } from "solid-js";
import { useNotifications } from "../store/NotificationContext";
import { useNavigate } from "@solidjs/router";
import { NotificationService, type Notification, type NotificationType, type NotificationPriority } from "../services/notificationService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    stats,
    loading,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    markMultipleAsRead,
    deleteMultiple,
    loadNotifications
  } = useNotifications();

  // State
  const [selectedNotifications, setSelectedNotifications] = createSignal<number[]>([]);
  const [filterType, setFilterType] = createSignal<NotificationType | 'all'>('all');
  const [filterPriority, setFilterPriority] = createSignal<NotificationPriority | 'all'>('all');
  const [filterRead, setFilterRead] = createSignal<'all' | 'read' | 'unread'>('all');
  const [sortBy, setSortBy] = createSignal<'date' | 'priority' | 'type'>('date');
  const [sortOrder, setSortOrder] = createSignal<'asc' | 'desc'>('desc');

  // Computed filtered notifications
  const filteredNotifications = () => {
    let filtered = notifications();

    // Filter by type
    if (filterType() !== 'all') {
      filtered = filtered.filter(notif => notif.type === filterType());
    }

    // Filter by priority
    if (filterPriority() !== 'all') {
      filtered = filtered.filter(notif => notif.priority === filterPriority());
    }

    // Filter by read status
    if (filterRead() === 'read') {
      filtered = filtered.filter(notif => notif.is_read);
    } else if (filterRead() === 'unread') {
      filtered = filtered.filter(notif => !notif.is_read);
    }

    // Sort notifications
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy()) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder() === 'desc' ? -comparison : comparison;
    });

    return filtered;
  };

  // Selection handlers
  const toggleNotificationSelection = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllFiltered = () => {
    const allFilteredIds = filteredNotifications().map(notif => notif.id);
    const allSelected = allFilteredIds.every(id => selectedNotifications().includes(id));

    if (allSelected) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(allFilteredIds);
    }
  };

  // Bulk actions
  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications().length === 0) return;
    await markMultipleAsRead(selectedNotifications());
    setSelectedNotifications([]);
  };

  const handleBulkMarkAsUnread = async () => {
    if (selectedNotifications().length === 0) return;
    
    for (const notifId of selectedNotifications()) {
      await markAsUnread(notifId);
    }
    setSelectedNotifications([]);
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications().length === 0) return;
    await deleteMultiple(selectedNotifications());
    setSelectedNotifications([]);
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  // Get filter options
  const getTypeOptions = () => [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'order', label: 'Pesanan' },
    { value: 'favorite', label: 'Favorit' },
    { value: 'cart', label: 'Keranjang' },
    { value: 'promo', label: 'Promo' },
    { value: 'system', label: 'Sistem' },
    { value: 'general', label: 'Umum' }
  ];

  const getPriorityOptions = () => [
    { value: 'all', label: 'Semua Prioritas' },
    { value: 'high', label: 'Tinggi' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Rendah' }
  ];

  const getReadOptions = () => [
    { value: 'all', label: 'Semua Status' },
    { value: 'unread', label: 'Belum Dibaca' },
    { value: 'read', label: 'Sudah Dibaca' }
  ];

  // Get notification type color
  const getTypeColor = (type: string) => {
    const colors = {
      order: 'bg-blue-100 text-blue-800 border-blue-200',
      favorite: 'bg-red-100 text-red-800 border-red-200',
      cart: 'bg-green-100 text-green-800 border-green-200',
      promo: 'bg-purple-100 text-purple-800 border-purple-200',
      system: 'bg-gray-100 text-gray-800 border-gray-200',
      general: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600',
      normal: 'text-blue-600',
      low: 'text-gray-600'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  // Clear selections when filters change
  createEffect(() => {
    filterType();
    filterPriority();
    filterRead();
    setSelectedNotifications([]);
  });

  return (
    <div class="min-h-screen bg-gray-50">
      <Navbar />
      
      <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Notifikasi</h1>
                <p class="mt-2 text-gray-600">
                  Kelola semua notifikasi Anda
                </p>
              </div>
              
              <button
                onClick={() => loadNotifications()}
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Stats Cards */}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5v-5a6 6 0 10-12 0v5l-5 5h5m7 0v1a3 3 0 01-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total</p>
                    <p class="text-2xl font-semibold text-gray-900">{stats()?.total_count || 0}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Belum Dibaca</p>
                    <p class="text-2xl font-semibold text-red-600">{unreadCount()}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Prioritas Tinggi</p>
                    <p class="text-2xl font-semibold text-yellow-600">{stats()?.high_priority_unread || 0}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Sudah Dibaca</p>
                    <p class="text-2xl font-semibold text-green-600">
                      {(stats()?.total_count || 0) - (stats()?.unread_count || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div class="bg-white rounded-lg shadow mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Filters */}
                <div class="flex flex-col sm:flex-row gap-4">
                  <select
                    value={filterType()}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <For each={getTypeOptions()}>
                      {(option) => <option value={option.value}>{option.label}</option>}
                    </For>
                  </select>

                  <select
                    value={filterPriority()}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <For each={getPriorityOptions()}>
                      {(option) => <option value={option.value}>{option.label}</option>}
                    </For>
                  </select>

                  <select
                    value={filterRead()}
                    onChange={(e) => setFilterRead(e.target.value as any)}
                    class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <For each={getReadOptions()}>
                      {(option) => <option value={option.value}>{option.label}</option>}
                    </For>
                  </select>
                </div>

                {/* Sort and Actions */}
                <div class="flex items-center gap-4">
                  <select
                    value={`${sortBy()}:${sortOrder()}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split(':');
                      setSortBy(sort as any);
                      setSortOrder(order as any);
                    }}
                    class="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="date:desc">Terbaru</option>
                    <option value="date:asc">Terlama</option>
                    <option value="priority:desc">Prioritas Tinggi</option>
                    <option value="priority:asc">Prioritas Rendah</option>
                    <option value="type:asc">Tipe A-Z</option>
                    <option value="type:desc">Tipe Z-A</option>
                  </select>

                  <Show when={unreadCount() > 0}>
                    <button
                      onClick={markAllAsRead}
                      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tandai Semua
                    </button>
                  </Show>
                </div>
              </div>

              {/* Selection and Bulk Actions */}
              <Show when={selectedNotifications().length > 0}>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div class="flex items-center">
                    <span class="text-sm text-gray-600 mr-4">
                      {selectedNotifications().length} notifikasi dipilih
                    </span>
                    <button
                      onClick={selectAllFiltered}
                      class="text-sm text-purple-600 hover:text-purple-800"
                    >
                      {filteredNotifications().every(notif => selectedNotifications().includes(notif.id))
                        ? 'Batalkan Semua'
                        : 'Pilih Semua'
                      }
                    </button>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      onClick={handleBulkMarkAsRead}
                      class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tandai Dibaca
                    </button>
                    
                    <button
                      onClick={handleBulkMarkAsUnread}
                      class="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tandai Belum Dibaca
                    </button>
                    
                    <button
                      onClick={handleBulkDelete}
                      class="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </Show>
            </div>
          </div>

          {/* Notifications List */}
          <div class="bg-white rounded-lg shadow">
            <Show
              when={!loading() && filteredNotifications().length > 0}
              fallback={
                <div class="p-12 text-center">
                  <Show
                    when={!loading()}
                    fallback={
                      <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span class="ml-3 text-gray-600">Memuat notifikasi...</span>
                      </div>
                    }
                  >
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5v-5a6 6 0 10-12 0v5l-5 5h5m7 0v1a3 3 0 01-6 0v-1m6 0H9" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada notifikasi</h3>
                    <p class="text-gray-500">
                      Tidak ada notifikasi yang cocok dengan filter yang dipilih.
                    </p>
                  </Show>
                </div>
              }
            >
              <div class="divide-y divide-gray-200">
                <For each={filteredNotifications()}>
                  {(notification) => (
                    <div
                      class={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div class="flex items-start space-x-4">
                        {/* Selection Checkbox */}
                        <div class="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={selectedNotifications().includes(notification.id)}
                            onChange={() => toggleNotificationSelection(notification.id)}
                            class="rounded text-purple-600 focus:ring-purple-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Notification Icon */}
                        <div class="flex-shrink-0">
                          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {NotificationService.getNotificationIcon(notification.type as any)}
                          </div>
                        </div>

                        {/* Content */}
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between mb-2">
                            <h3 class={`text-lg font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <div class="flex items-center space-x-2 ml-4">
                              <span class={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                {notification.priority.toUpperCase()}
                              </span>
                              <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </span>
                            </div>
                          </div>

                          <p class="text-gray-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">
                              {NotificationService.formatNotificationTime(notification.created_at)}
                            </span>
                            
                            <div class="flex items-center space-x-3">
                              <Show when={!notification.is_read}>
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                                  Belum Dibaca
                                </span>
                              </Show>
                              
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (notification.is_read) {
                                    await markAsUnread(notification.id);
                                  } else {
                                    await markAsRead(notification.id);
                                  }
                                }}
                                class="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                                title={notification.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                              >
                                {notification.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca'}
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                class="text-sm text-gray-500 hover:text-red-600 transition-colors"
                                title="Hapus notifikasi"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>

                          <Show when={notification.action_url}>
                            <div class="mt-3 pt-3 border-t border-gray-200">
                              <span class="text-sm text-purple-600 font-medium">
                                Klik untuk melihat detail →
                              </span>
                            </div>
                          </Show>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>

          {/* Load More or Pagination could be added here */}
          <Show when={filteredNotifications().length > 0}>
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-500">
                Menampilkan {filteredNotifications().length} dari {stats()?.total_count || 0} notifikasi
              </p>
            </div>
          </Show>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}