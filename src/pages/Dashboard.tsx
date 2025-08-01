import { type Component, createSignal, onMount, For } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartAmChart5 from "../components/ChartAmChart5";
import AgGridSolid from "solid-ag-grid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Tipe produk
type Produk = {
  id: number;
  produk: string;
  stok: number;
  terjual: number;
  revenue: number;
  status: string;
};

// Data dummy enhanced
const rowData: Produk[] = [
  { id: 1, produk: "Batik Mega Mendung", stok: 12, terjual: 30, revenue: 10500000, status: "active" },
  { id: 2, produk: "Batik Kawung", stok: 8, terjual: 25, revenue: 8750000, status: "low-stock" },
  { id: 3, produk: "Batik Parang", stok: 10, terjual: 40, revenue: 14000000, status: "active" },
  { id: 4, produk: "Batik Sekar Jagad", stok: 15, terjual: 22, revenue: 7700000, status: "active" },
  { id: 5, produk: "Batik Truntum", stok: 3, terjual: 35, revenue: 12250000, status: "low-stock" },
];

// Enhanced column definitions
const colDefs = [
  { 
    field: "id", 
    headerName: "ID",
    width: 70,
    cellClass: "text-center"
  },
  { 
    field: "produk", 
    headerName: "Nama Produk",
    flex: 1,
    minWidth: 200
  },
  { 
    field: "stok", 
    headerName: "Stok",
    width: 100,
    sortable: true,
    cellClassRules: {
      'text-red-600 font-bold': (params: any) => params.value < 5,
      'text-yellow-600': (params: any) => params.value >= 5 && params.value < 10,
      'text-green-600': (params: any) => params.value >= 10
    }
  },
  { 
    field: "terjual", 
    headerName: "Terjual",
    width: 100,
    sortable: true
  },
  {
    field: "revenue",
    headerName: "Revenue",
    width: 150,
    sortable: true,
    valueFormatter: (params: any) => `Rp ${params.value.toLocaleString('id-ID')}`
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    cellRenderer: (params: any) => {
      const statusClass = params.value === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800';
      const statusText = params.value === 'active' ? 'Aktif' : 'Stok Rendah';
      return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>`;
    }
  }
] as any[];

const Dashboard: Component = () => {
  const [animateIn, setAnimateIn] = createSignal(false);
  const [selectedPeriod, setSelectedPeriod] = createSignal("month");

  // Enhanced stats data
  const stats = [
    {
      title: "Total Penjualan",
      value: "Rp 83.3M",
      change: "+22.5%",
      icon: "💰",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "Produk Terjual",
      value: "2,567",
      change: "+15.8%",
      icon: "📦",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "Total Profit",
      value: "Rp 28.7M",
      change: "+18.2%",
      icon: "📈",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      title: "Rating Produk",
      value: "4.9",
      change: "+0.2",
      icon: "⭐",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    }
  ];

  // Enhanced recent orders
  const recentOrders = [
    { 
      id: "#ORD001", 
      customer: "Dewi Sartika", 
      product: "Batik Mega Mendung", 
      total: "Rp 350.000", 
      status: "completed",
      time: "2 jam lalu"
    },
    { 
      id: "#ORD002", 
      customer: "Budi Santoso", 
      product: "Batik Kawung", 
      total: "Rp 425.000", 
      status: "processing",
      time: "4 jam lalu"
    },
    { 
      id: "#ORD003", 
      customer: "Maya Putri", 
      product: "Batik Parang", 
      total: "Rp 295.000", 
      status: "pending",
      time: "6 jam lalu"
    },
    { 
      id: "#ORD004", 
      customer: "Ahmad Rahman", 
      product: "Batik Truntum", 
      total: "Rp 380.000", 
      status: "completed",
      time: "8 jam lalu"
    },
  ];

  const periods = [
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
    { value: "year", label: "Tahun Ini" }
  ];

  onMount(() => {
    setTimeout(() => setAnimateIn(true), 100);
  });

  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Header */}
        <div class="relative overflow-hidden bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 text-white pt-20 pb-32">
          <div class="absolute inset-0 bg-black opacity-20"></div>
          <div class="absolute inset-0">
            <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-20 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
          
          <div class="relative container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 class={`text-4xl md:text-5xl font-bold mb-2 transition-all duration-700 ${
                  animateIn() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}>
                  Dashboard Admin
                </h1>
                <p class={`text-slate-200 transition-all duration-700 delay-100 ${
                  animateIn() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}>
                  Selamat datang kembali! Berikut ringkasan performa bisnis Anda.
                </p>
              </div>
              
              {/* Period Selector */}
              <div class={`flex gap-2 transition-all duration-700 delay-200 ${
                animateIn() ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}>
                <For each={periods}>
                  {(period) => (
                    <button
                      onClick={() => setSelectedPeriod(period.value)}
                      class={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedPeriod() === period.value
                          ? "bg-white text-purple-600 shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {period.label}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>

        <div class="container mx-auto px-6 -mt-20">
          {/* Enhanced Stats Cards */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <For each={stats}>
              {(stat, index) => (
                <div 
                  class={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${stat.borderColor} p-6 transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                    animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ "animation-delay": `${index() * 100}ms` }}
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center text-2xl border ${stat.borderColor}`}>
                      {stat.icon}
                    </div>
                    <span class={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.change.startsWith('+') 
                        ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20" 
                        : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p class="text-2xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              )}
            </For>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section - Menggunakan komponen ChartAmChart5 yang baru */}
            <div class="lg:col-span-2">
              <ChartAmChart5 />
            </div>

            {/* Enhanced Recent Orders */}
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span>📋</span>
                    Pesanan Terbaru
                  </h2>
                  <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <div class="space-y-4">
                  <For each={recentOrders}>
                    {(order) => (
                      <div class="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <p class="font-semibold text-gray-800 dark:text-white text-sm">
                                {order.customer}
                              </p>
                              <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : order.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}>
                                {order.status === 'completed' ? 'Selesai' : 
                                 order.status === 'processing' ? 'Diproses' : 'Menunggu'}
                              </span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {order.product}
                            </p>
                            <div class="flex items-center justify-between text-xs">
                              <span class="text-gray-500 dark:text-gray-500">
                                {order.id} • {order.time}
                              </span>
                              <span class="font-semibold text-purple-600 dark:text-purple-400">
                                {order.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <button class="w-full mt-4 text-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors py-2 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Lihat Semua Pesanan →
                </button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span>📦</span>
                Data Produk
              </h2>
              <div class="flex gap-3">
                <button class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Produk
                </button>
                <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="ag-theme-alpine dark:ag-theme-alpine-dark rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600" style="height: 400px; width: 100%;">
              <AgGridSolid
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                animateRows={true}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
                  📊
                </div>
                <svg class="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 class="font-semibold mb-1">Laporan Bulanan</h3>
              <p class="text-sm opacity-90">Generate laporan penjualan detail</p>
              <div class="mt-3 flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Data terbaru tersedia</span>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
                  🎯
                </div>
                <svg class="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 class="font-semibold mb-1">Target Penjualan</h3>
              <p class="text-sm opacity-90">Atur dan monitor target bulanan</p>
              <div class="mt-3 flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>8/12 target tercapai</span>
              </div>
            </div>

            {/* Admin Chat Card */}
            <a href="/admin/chat" class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 block">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
                  💬
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                  <span class="text-xs">3</span>
                </div>
              </div>
              <h3 class="font-semibold mb-1">Admin Chat</h3>
              <p class="text-sm opacity-90">Kelola chat dengan pelanggan</p>
              <div class="mt-3 flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span>3 pesan belum dibalas</span>
              </div>
            </a>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
                  🔔
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                  <span class="text-xs">5</span>
                </div>
              </div>
              <h3 class="font-semibold mb-1">Notifikasi</h3>
              <p class="text-sm opacity-90">5 notifikasi penting menunggu</p>
              <div class="mt-3 flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span>3 stok rendah, 2 pesanan baru</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default Dashboard;