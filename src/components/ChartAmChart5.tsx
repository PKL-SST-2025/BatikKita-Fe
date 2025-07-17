import { type Component, createSignal, Show, onMount, onCleanup } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

const ChartAmChart5: Component = () => {
  const [chartView, setChartView] = createSignal("comparison");
  const [animateChart, setAnimateChart] = createSignal(false);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  
  let chartDiv: HTMLDivElement | undefined;
  let root: am5.Root | undefined;
  let chart: am5xy.XYChart | undefined;

  // Data penjualan
  const chartData = [
    { month: "Jan", sales: 4.5, target: 5.0, profit: 1.2, orders: 145 },
    { month: "Feb", sales: 5.2, target: 5.5, profit: 1.8, orders: 167 },
    { month: "Mar", sales: 4.8, target: 5.0, profit: 1.5, orders: 156 },
    { month: "Apr", sales: 6.1, target: 6.0, profit: 2.1, orders: 189 },
    { month: "Mei", sales: 5.8, target: 6.0, profit: 1.9, orders: 178 },
    { month: "Jun", sales: 7.2, target: 7.0, profit: 2.5, orders: 234 },
    { month: "Jul", sales: 6.9, target: 7.0, profit: 2.3, orders: 223 },
    { month: "Agu", sales: 7.5, target: 7.5, profit: 2.7, orders: 245 },
    { month: "Sep", sales: 8.1, target: 8.0, profit: 3.1, orders: 267 },
    { month: "Okt", sales: 7.8, target: 8.0, profit: 2.9, orders: 256 },
    { month: "Nov", sales: 9.2, target: 9.0, profit: 3.5, orders: 289 },
    { month: "Des", sales: 10.5, target: 10.0, profit: 4.2, orders: 324 }
  ];

  // Check for dark mode
  const checkDarkMode = () => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  const createChart = () => {
    if (!chartDiv) return;

    // Create root
    root = am5.Root.new(chartDiv);

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    if (isDarkMode()) {
      root.setThemes([
        am5themes_Animated.new(root),
        am5themes_Dark.new(root)
      ]);
    }

    // Create chart
    chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 20,
        paddingBottom: 0
      })
    );

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 50
    });
    xRenderer.labels.template.setAll({
      fontSize: 12,
      fontWeight: "500"
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "month",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({
      fontSize: 12,
      fontWeight: "500"
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        min: 0,
        extraMax: 0.1
      })
    );

    // Sales series (Column)
    const salesSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Penjualan",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "sales",
        categoryXField: "month",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Penjualan: Rp {valueY}M"
        })
      })
    );

    // Simple solid color styling
    salesSeries.columns.template.setAll({
      cornerRadiusTL: 8,
      cornerRadiusTR: 8,
      strokeOpacity: 0,
      fill: am5.color("#3B82F6")
    });

    // Hover effect
    salesSeries.columns.template.states.create("hover", {
      fill: am5.color("#1D4ED8")
    });

    // Target series (Line)
    const targetSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Target",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "target",
        categoryXField: "month",
        stroke: am5.color("#8B5CF6"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Target: Rp {valueY}M"
        })
      })
    );

    targetSeries.strokes.template.setAll({
      strokeWidth: 3,
      strokeDasharray: [5, 5]
    });

    targetSeries.bullets.push(() => {
      return am5.Bullet.new(root!, {
        sprite: am5.Circle.new(root!, {
          radius: 6,
          fill: am5.color("#8B5CF6"),
          stroke: am5.color("#FFFFFF"),
          strokeWidth: 2
        })
      });
    });

    // Profit series (Line with area fill)
    const profitSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Profit",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "profit",
        categoryXField: "month",
        stroke: am5.color("#10B981"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Profit: Rp {valueY}M"
        })
      })
    );

    profitSeries.strokes.template.setAll({
      strokeWidth: 2
    });

    // Add area fill
    profitSeries.set("fill", am5.color("#10B981"));
    profitSeries.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true
    });

    // Set data
    const data = chartData;
    xAxis.data.setAll(data);
    salesSeries.data.setAll(data);
    targetSeries.data.setAll(data);
    profitSeries.data.setAll(data);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
      xAxis: xAxis,
      yAxis: yAxis
    }));

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
        marginBottom: 5
      })
    );

    // Function to update series visibility
    const updateSeriesVisibility = () => {
      const view = chartView();
      
      // Hide/show series with animation
      if (view === "comparison") {
        salesSeries.show();
        targetSeries.show();
        profitSeries.show();
      } else if (view === "sales") {
        salesSeries.show();
        targetSeries.hide();
        profitSeries.hide();
      } else if (view === "target") {
        salesSeries.hide();
        targetSeries.show();
        profitSeries.hide();
      } else if (view === "profit") {
        salesSeries.hide();
        targetSeries.hide();
        profitSeries.show();
      }
      
      // Update legend to show only visible series
      const visibleSeries = chart!.series.values.filter(series => series.get("visible"));
      legend.data.setAll(visibleSeries);
    };

    // Initial visibility setup
    updateSeriesVisibility();

    // Animate on load
    salesSeries.appear(1000);
    targetSeries.appear(1000);
    profitSeries.appear(1000);
    chart.appear(1000, 100);

    // Return the update function for external use
    return updateSeriesVisibility;
  };

  const disposeChart = () => {
    if (root) {
      root.dispose();
      root = undefined;
      chart = undefined;
    }
  };

  let updateSeriesVisibility: (() => void) | undefined;

  onMount(() => {
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    setTimeout(() => {
      setAnimateChart(true);
      updateSeriesVisibility = createChart();
    }, 100);

    onCleanup(() => {
      observer.disconnect();
      disposeChart();
    });
  });

  // Update chart when view changes without recreating
  const handleViewChange = (view: string) => {
    setChartView(view);
    // Use the update function instead of recreating the chart
    if (updateSeriesVisibility) {
      updateSeriesVisibility();
    }
  };

  return (
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
      {/* Header */}
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          Analisis Penjualan
        </h2>
        <div class="flex items-center gap-4">
          <Show when={chartView() === "comparison" || chartView() === "sales"}>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Penjualan</span>
            </div>
          </Show>
          <Show when={chartView() === "comparison" || chartView() === "target"}>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Target</span>
            </div>
          </Show>
          <Show when={chartView() === "comparison" || chartView() === "profit"}>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Profit</span>
            </div>
          </Show>
        </div>
      </div>
      
      {/* View Selector */}
      <div class="flex justify-center gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
        <button
          onClick={() => handleViewChange('comparison')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'comparison'
              ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <span>📊</span>
          <span>Perbandingan</span>
        </button>
        <button
          onClick={() => handleViewChange('sales')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'sales'
              ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <span>💰</span>
          <span>Penjualan</span>
        </button>
        <button
          onClick={() => handleViewChange('target')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'target'
              ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <span>🎯</span>
          <span>Target</span>
        </button>
        <button
          onClick={() => handleViewChange('profit')}
          class={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            chartView() === 'profit'
              ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <span>💚</span>
          <span>Profit</span>
        </button>
      </div>

      {/* Chart Container */}
      <div class="relative bg-gray-50 dark:bg-gray-900/20 rounded-xl p-4 min-h-[400px]">
        <div 
          ref={chartDiv} 
          class="w-full h-96"
          style="width: 100%; height: 400px;"
        ></div>
      </div>

      {/* Enhanced Summary Stats */}
      <div class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Total Penjualan</span>
            <span class="text-2xl">💰</span>
          </div>
          <p class="text-2xl font-bold text-blue-800 dark:text-blue-300">
            Rp 83.3M
          </p>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-xs text-green-600 font-medium">↗ +22.5%</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">vs tahun lalu</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">Target Tercapai</span>
            <span class="text-2xl">🎯</span>
          </div>
          <p class="text-2xl font-bold text-purple-800 dark:text-purple-300">
            8/12
          </p>
          <div class="mt-2 h-2 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000"
              style={{ width: animateChart() ? "66.7%" : "0%" }}
            />
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Total Profit</span>
            <span class="text-2xl">📈</span>
          </div>
          <p class="text-2xl font-bold text-green-800 dark:text-green-300">
            Rp 28.7M
          </p>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-xs text-green-600 font-medium">34.4%</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">margin</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-orange-700 dark:text-orange-400">Bulan Terbaik</span>
            <span class="text-2xl">🏆</span>
          </div>
          <p class="text-2xl font-bold text-orange-800 dark:text-orange-300">
            Desember
          </p>
          <div class="flex items-center gap-1 mt-1">
            <span class="text-xs text-orange-600 font-medium">Rp 10.5M</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">penjualan</span>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div class="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <span>🔍</span>
          Insights Performa
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p class="font-medium text-gray-800 dark:text-gray-200">Tren Positif</p>
              <p class="text-gray-600 dark:text-gray-400">Penjualan meningkat 22.5% dibanding tahun lalu dengan profit margin yang stabil</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p class="font-medium text-gray-800 dark:text-gray-200">Target Achievement</p>
              <p class="text-gray-600 dark:text-gray-400">8 dari 12 bulan berhasil mencapai target penjualan yang ditetapkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartAmChart5;