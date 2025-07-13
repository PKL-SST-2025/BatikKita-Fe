import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { onCleanup, onMount } from "solid-js";

export default function ChartPenjualan() {
  onMount(() => {
    let root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "bulan",
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Penjualan",
        xAxis,
        yAxis,
        valueYField: "jumlah",
        categoryXField: "bulan",
      })
    );

    // Data dummy
    series.data.setAll([
      { bulan: "Jan", jumlah: 30 },
      { bulan: "Feb", jumlah: 45 },
      { bulan: "Mar", jumlah: 60 },
      { bulan: "Apr", jumlah: 50 },
      { bulan: "Mei", jumlah: 70 },
      { bulan: "Jun", jumlah: 90 },
    ]);

    xAxis.data.setAll(series.dataItems.map(item => item.dataContext));
    onCleanup(() => root.dispose());
  });

  return <div id="chartdiv" class="w-full h-96"></div>;
}