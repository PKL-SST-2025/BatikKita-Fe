import { type Component, createSignal, For, Show, onMount } from "solid-js";

const ChartPenjualan: Component = () => {
  const [chartView, setChartView] = createSignal("comparison");
  const [animateChart, setAnimateChart] = createSignal(false);

  // Data dalam jutaan untuk memudahkan
  const chartData = [
    { month: "Jan", sales: 4.5, target: 5.0 },
    { month: "Feb", sales: 5.2, target: 5.5 },
    { month: "Mar", sales: 4.8, target: 5.0 },
    { month: "Apr", sales: 6.1, target: 6.0 },
    { month: "Mei", sales: 5.8, target: 6.0 },
    { month: "Jun", sales: 7.2, target: 7.0 },
    { month: "Jul", sales: 6.9, target: 7.0 },
    { month: "Agu", sales: 7.5, target: 7.5 },
  ];

  onMount(() => {
    // Trigger animation after mount
    setTimeout(() => setAnimateChart(true), 100);
  });

  const maxValue = 10; // 10 juta

  return (
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          Grafik Penjualan
        </h2>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Penjualan</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Target</span>
          </div>
        </div>
      </div>
      
      {/* View Selector */}
      <div class="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setChartView('comparison')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'comparison'
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <span>📊</span>
          <span>Perbandingan</span>
        </button>
        <button
          onClick={() => setChartView('sales')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'sales'
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <span>💰</span>
          <span>Penjualan</span>
        </button>
        <button
          onClick={() => setChartView('target')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'target'
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <span>🎯</span>
          <span>Target</span>
        </button>
      </div>

      {/* Chart Container */}
      <div class="relative bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
        <div class="flex h-64">
          {/* Y-axis labels */}
          <div class="flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400 pr-2">
            <span>Rp 10M</span>
            <span>Rp 7.5M</span>
            <span>Rp 5M</span>
            <span>Rp 2.5M</span>
            <span>Rp 0</span>
          </div>

          {/* Chart Area */}
          <div class="flex-1 relative">
            {/* Grid lines */}
            <div class="absolute inset-0">
              <div class="h-full flex flex-col justify-between">
                <div class="border-b border-gray-200 dark:border-gray-700 border-dashed"></div>
                <div class="border-b border-gray-200 dark:border-gray-700 border-dashed"></div>
                <div class="border-b border-gray-200 dark:border-gray-700 border-dashed"></div>
                <div class="border-b border-gray-200 dark:border-gray-700 border-dashed"></div>
                <div class="border-b border-gray-200 dark:border-gray-700 border-dashed"></div>
              </div>
            </div>

            {/* Bars */}
            <div class="relative h-full flex items-end justify-around px-4">
              <For each={chartData}>
                {(item, index) => {
                  const salesHeight = animateChart() ? (item.sales / maxValue) * 100 : 0;
                  const targetHeight = animateChart() ? (item.target / maxValue) * 100 : 0;
                  
                  return (
                    <div class="flex-1 flex flex-col items-center">
                      <div class="flex items-end gap-1 h-full w-full max-w-20">
                        {/* Sales Bar */}
                        <Show when={chartView() !== 'target'}>
                          <div class="flex-1 flex flex-col justify-end">
                            <div 
                              class="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-1000 ease-out hover:from-blue-700 hover:to-blue-500"
                              style={{
                                height: `${salesHeight}%`,
                                "transition-delay": `${index() * 100}ms`
                              }}
                            />
                          </div>
                        </Show>
                        
                        {/* Target Bar */}
                        <Show when={chartView() !== 'sales'}>
                          <div class="flex-1 flex flex-col justify-end">
                            <div 
                              class="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-1000 ease-out hover:from-purple-700 hover:to-purple-500"
                              style={{
                                height: `${targetHeight}%`,
                                "transition-delay": `${index() * 100 + 50}ms`
                              }}
                            />
                          </div>
                        </Show>
                      </div>
                      
                      {/* X-axis label */}
                      <span class="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div class="mt-8 grid grid-cols-3 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Total Penjualan</span>
            <span class="text-2xl">💰</span>
          </div>
          <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
            Rp 45.2M
          </p>
          <p class="text-xs text-green-600 font-medium mt-1">↑ +15.3%</p>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Target Tercapai</span>
            <span class="text-2xl">🎯</span>
          </div>
          <p class="text-xl font-bold text-purple-600 dark:text-purple-400">
            3/8 Bulan
          </p>
          <div class="mt-2 h-2 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
            <div 
              class="h-full bg-purple-500 rounded-full transition-all duration-1000"
              style={{ width: animateChart() ? "37.5%" : "0%" }}
            />
          </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Bulan Terbaik</span>
            <span class="text-2xl">🏆</span>
          </div>
          <p class="text-xl font-bold text-green-600 dark:text-green-400">
            Agustus
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Rp 7.5M penjualan
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartPenjualan;