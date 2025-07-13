import type { Component } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartPenjualan from "../components/ChartPenjualan";
import AgGridSolid from "solid-ag-grid";
import type { ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Data Produk

type Produk = {
  id: number;
  produk: string;
  stok: number;
  terjual: number;
};

const rowData: Produk[] = [
  { id: 1, produk: "Batik Mega Mendung", stok: 12, terjual: 30 },
  { id: 2, produk: "Batik Kawung", stok: 8, terjual: 25 },
  { id: 3, produk: "Batik Parang", stok: 10, terjual: 40 },
];

const colDefs: ColDef<Produk>[] = [
  { field: "id", headerName: "ID" },
  { field: "produk", headerName: "Nama Produk" },
  { field: "stok", headerName: "Stok" },
  { field: "terjual", headerName: "Terjual" },
];

const Dashboard: Component = () => {
  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 overflow-hidden">
        <div class="container mx-auto px-6 py-20">
          <h2 class="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
            Dashboard Admin
          </h2>

          <section class="mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
            <h3 class="text-2xl font-semibold text-gray-700 dark:text-white mb-4">
              Grafik Penjualan
            </h3>
            <ChartPenjualan />
          </section>

          <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
            <h3 class="text-2xl font-semibold text-gray-700 dark:text-white mb-4">
              Data Produk
            </h3>
            <div class="ag-theme-alpine dark:bg-gray-800" style="height: 400px; width: 100%;">
              <AgGridSolid rowData={rowData} columnDefs={colDefs} />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
