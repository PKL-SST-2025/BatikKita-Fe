import { type Component, createSignal, onMount, For } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartPenjualan from "../components/ChartPenjualan";
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

  // Stats data
  const stats = [
    {
      title: "Total Penjualan",
      value: "Rp 45.2M",
      change: "+12.5%",
      icon: "💰",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Produk Terjual",
      value: "1,234",
      change: "+8.2%",
      icon: "📦",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Pelanggan Baru",
      value: "89",
      change: "+23.1%",
      icon: "👥",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Rating Produk",
      value: "4.8",
      change: "+0.3",
      icon: "⭐",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const recentOrders = [
    { id: "#ORD001", customer: "Dewi Sartika", product: "Batik Mega Mendung", total: "Rp 350.000", status: "completed" },
    { id: "#ORD002", customer: "Budi Santoso", product: "Batik Kawung", total: "Rp 425.000", status: "processing" },
    { id: "#ORD003", customer: "Maya Putri", product: "Batik Parang", total: "Rp 295.000", status: "pending" },
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
        {/* Header */}
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-20 pb-32">
          <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 class={`text-4xl md:text-5xl font-bold mb-2 transition-all duration-700 ${
                  animateIn() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}>
                  Dashboard Admin
                </h1>
                <p class={`text-blue-100 transition-all duration-700 delay-100 ${
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
          {/* Stats Cards */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <For each={stats}>
              {(stat, index) => (
                <div 
                  class={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                    animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ "animation-delay": `${index() * 100}ms` }}
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                      {stat.icon}
                    </div>
                    <span class={`text-sm font-medium ${
                      stat.change.startsWith('+') ? "text-green-600" : "text-red-600"
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
            {/* Chart Section - Menggunakan komponen ChartPenjualan */}
            <div class="lg:col-span-2">
              <ChartPenjualan 
                period={selectedPeriod() as "week" | "month" | "year"}
                onDataClick={(data) => {
                  console.log(`Clicked on ${data.month}: Sales ${data.sales}, Target ${data.target}`);

                }}
              />
            </div>

            {/* Recent Orders - Takes 1 column */}
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Pesanan Terbaru
                </h2>
                <div class="space-y-4">
                  <For each={recentOrders}>
                    {(order) => (
                      <div class="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                        <div class="flex items-start justify-between mb-2">
                          <div>
                            <p class="font-semibold text-gray-800 dark:text-white">
                              {order.customer}
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              {order.product}
                            </p>
                          </div>
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
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-500 dark:text-gray-500">
                            {order.id}
                          </span>
                          <span class="font-semibold text-purple-600 dark:text-purple-400">
                            {order.total}
                          </span>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <button class="w-full mt-4 text-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  Lihat Semua Pesanan →
                </button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Data Produk
              </h2>
              <div class="flex gap-3">
                <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Produk
                </button>
                <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="ag-theme-alpine dark:ag-theme-alpine-dark rounded-lg overflow-hidden" style="height: 400px; width: 100%;">
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

          {/* Quick Actions */}
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <svg class="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 class="font-semibold mb-1">Laporan Bulanan</h3>
              <p class="text-sm opacity-90">Generate laporan penjualan</p>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  🎯
                </div>
                <svg class="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 class="font-semibold mb-1">Target Penjualan</h3>
              <p class="text-sm opacity-90">Atur target bulanan</p>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  🔔
                </div>
                <svg class="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 class="font-semibold mb-1">Notifikasi</h3>
              <p class="text-sm opacity-90">5 notifikasi baru</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;