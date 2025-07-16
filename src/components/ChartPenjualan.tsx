import { type Component, createSignal, For, onMount } from "solid-js";

interface ChartDataItem {
  month: string;
  sales: number;
  target: number;
}

interface ChartPenjualanProps {
  data?: ChartDataItem[];
  period?: "week" | "month" | "year";
  onDataClick?: (data: ChartDataItem, index: number) => void;
}

const ChartPenjualan: Component<ChartPenjualanProps> = (props) => {
  const [chartView, setChartView] = createSignal("comparison");
  const [hoveredBar, setHoveredBar] = createSignal<number | null>(null);
  const [chartAnimated, setChartAnimated] = createSignal(false);

  // Default data jika tidak ada props
  const defaultData: ChartDataItem[] = [
    { month: "Jan", sales: 4500000, target: 5000000 },
    { month: "Feb", sales: 5200000, target: 5500000 },
    { month: "Mar", sales: 4800000, target: 5000000 },
    { month: "Apr", sales: 6100000, target: 6000000 },
    { month: "Mei", sales: 5800000, target: 6000000 },
    { month: "Jun", sales: 7200000, target: 7000000 },
    { month: "Jul", sales: 6900000, target: 7000000 },
    { month: "Agu", sales: 7500000, target: 7500000 },
  ];

  const chartData = () => props.data || defaultData;

  // Calculate summary stats dynamically
  const totalSales = () => chartData().reduce((sum, item) => sum + item.sales, 0);
  const targetsAchieved = () => chartData().filter(item => item.sales >= item.target).length;
  const bestMonth = () => {
    const best = chartData().reduce((prev, current) => 
      prev.sales > current.sales ? prev : current
    );
    return best;
  };

  // Format period text
  const periodText = () => {
    switch (props.period) {
      case "week": return "Minggu Ini";
      case "year": return "Tahun Ini";
      default: return "Bulan Ini";
    }
  };

  onMount(() => {
    setTimeout(() => setChartAnimated(true), 100);
  });

  const handleBarClick = (data: ChartDataItem, index: number) => {
    if (props.onDataClick) {
      props.onDataClick(data, index);
    }
  };

  return (
    <>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            Grafik Penjualan
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Periode: {periodText()}
          </p>
        </div>
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
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span>📊</span>
          <span>Perbandingan</span>
        </button>
        <button
          onClick={() => setChartView('sales')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'sales'
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span>💰</span>
          <span>Penjualan</span>
        </button>
        <button
          onClick={() => setChartView('target')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'target'
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span>🎯</span>
          <span>Target</span>
        </button>
      </div>

      {/* Chart Container */}
      <div class="relative h-80 w-full">
        {/* Y-axis labels */}
        <div class="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Rp 10M</span>
          <span>Rp 7.5M</span>
          <span>Rp 5M</span>
          <span>Rp 2.5M</span>
          <span>Rp 0</span>
        </div>

        {/* Grid lines */}
        <div class="absolute left-16 right-0 top-0 bottom-8">
          <For each={[0, 25, 50, 75, 100]}>
            {(percentage) => (
              <div 
                class="absolute w-full border-t border-gray-200 dark:border-gray-700 border-dashed"
                style={{ bottom: `${percentage}%` }}
              />
            )}
          </For>
        </div>

        {/* Bars Container */}
        <div class="absolute left-16 right-0 top-0 bottom-8 flex items-end justify-around px-4">
          <For each={chartData()}>
            {(data, index) => (
              <div 
                class="relative flex-1 mx-2 flex items-end gap-1"
                onMouseEnter={() => setHoveredBar(index())}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => handleBarClick(data, index())}
              >
                {/* Sales Bar */}
                <div 
                  class={`relative flex-1 transition-all duration-1000 ease-out cursor-pointer ${
                    chartView() === 'target' ? 'opacity-0 w-0' : ''
                  }`}
                  style={{
                    height: chartAnimated() ? `${(data.sales / 10000000) * 100}%` : '0%',
                    "transition-delay": `${index() * 100}ms`
                  }}
                >
                  <div class={`w-full h-full rounded-t-lg transition-all duration-300 overflow-hidden ${
                    hoveredBar() === index() ? 'shadow-lg transform scale-105' : ''
                  }`}>
                    {/* Gradient background */}
                    <div class="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400">
                      {/* Animated shine effect */}
                      <div class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div class="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 animate-shine"></div>
                      </div>
                    </div>
                    
                    {/* Pattern overlay */}
                    <div class="absolute inset-0 opacity-20">
                      <div class="h-full w-full" style={{
                        "background-image": "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)"
                      }}></div>
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div class={`absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all duration-300 z-10 ${
                    hoveredBar() === index() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}>
                    <div class="font-semibold">Penjualan</div>
                    <div>Rp {(data.sales / 1000000).toFixed(1)}M</div>
                    <div class={`text-xs ${data.sales >= data.target ? 'text-green-400' : 'text-red-400'}`}>
                      {data.sales >= data.target ? '✓ Target tercapai' : '✗ Below target'}
                    </div>
                    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </div>

                  {/* Value label */}
                  <div class={`absolute -top-6 left-0 right-0 text-center text-xs font-bold transition-all duration-300 ${
                    chartAnimated() && hoveredBar() === index() ? 'opacity-100' : 'opacity-0'
                  } ${
                    data.sales >= data.target ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {(data.sales / 1000000).toFixed(1)}M
                  </div>
                </div>

                {/* Target Bar */}
                <div 
                  class={`relative flex-1 transition-all duration-1000 ease-out cursor-pointer ${
                    chartView() === 'sales' ? 'opacity-0 w-0' : ''
                  }`}
                  style={{
                    height: chartAnimated() ? `${(data.target / 10000000) * 100}%` : '0%',
                    "transition-delay": `${index() * 100 + 50}ms`
                  }}
                >
                  <div class={`w-full h-full rounded-t-lg transition-all duration-300 overflow-hidden ${
                    hoveredBar() === index() ? 'shadow-lg transform scale-105' : ''
                  }`}>
                    {/* Gradient background */}
                    <div class="absolute inset-0 bg-gradient-to-t from-purple-600 to-purple-400">
                      {/* Animated pulse effect */}
                      <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
                    </div>
                    
                    {/* Dots pattern */}
                    <div class="absolute inset-0 opacity-20" style={{
                      "background-image": "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                      "background-size": "10px 10px"
                    }}></div>
                  </div>

                  {/* Tooltip */}
                  <div class={`absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all duration-300 z-10 ${
                    hoveredBar() === index() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}>
                    <div class="font-semibold">Target</div>
                    <div>Rp {(data.target / 1000000).toFixed(1)}M</div>
                    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </div>
                </div>

                {/* Achievement indicator */}
                <div class={`absolute -top-12 left-0 right-0 flex justify-center transition-all duration-500 ${
                  hoveredBar() === index() && chartView() === 'comparison' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                  <div class={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    data.sales >= data.target 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}>
                    {data.sales >= data.target ? 
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      : 
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                    }
                    {Math.abs(((data.sales - data.target) / data.target) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* X-axis labels */}
        <div class="absolute left-16 right-0 bottom-0 h-8 flex items-center justify-around px-4">
          <For each={chartData()}>
            {(data, index) => (
              <div class="flex-1 text-center">
                <span class={`text-sm font-medium transition-all duration-300 ${
                  hoveredBar() === index() 
                    ? 'text-gray-900 dark:text-white transform scale-110 font-bold' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {data.month}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Summary Stats */}
      <div class="mt-8 grid grid-cols-3 gap-4">
        <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
          <div class="relative flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Total Penjualan</span>
            <span class="text-2xl">💰</span>
          </div>
          <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
            Rp {(totalSales() / 1000000).toFixed(1)}M
          </p>
          <div class="flex items-center gap-1 mt-1">
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <span class="text-xs text-green-600 font-medium">+15.3%</span>
          </div>
        </div>

        <div class="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"></div>
          <div class="relative flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Target Tercapai</span>
            <span class="text-2xl">🎯</span>
          </div>
          <p class="text-xl font-bold text-purple-600 dark:text-purple-400">
            {targetsAchieved()}/{chartData().length} Bulan
          </p>
          <div class="mt-1">
            <div class="h-2 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" 
                style={{ width: `${(targetsAchieved() / chartData().length) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div class="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-green-200/30 rounded-full blur-xl"></div>
          <div class="relative flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Bulan Terbaik</span>
            <span class="text-2xl">🏆</span>
          </div>
          <p class="text-xl font-bold text-green-600 dark:text-green-400">
            {bestMonth().month}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Rp {(bestMonth().sales / 1000000).toFixed(1)}M penjualan
          </p>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes shine {
        0% { transform: translateX(-100%) skewX(-12deg); }
        100% { transform: translateX(200%) skewX(-12deg); }
      }
      
      .animate-shine {
        animation: shine 2s ease-in-out;
      }
      
      .w-full:hover .animate-shine {
        animation: shine 2s ease-in-out infinite;
      }
    `}</style>
    </>
  );
};

export default ChartPenjualan;