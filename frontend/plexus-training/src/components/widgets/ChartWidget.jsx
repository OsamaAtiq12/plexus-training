/**
 * ChartWidget displays a chart with customizable properties.
 *
 * Props:
 * @param {string} title - The title of the widget/chart.
 * @param {object} data - Chart.js data object.
 * @param {object} options - Chart.js options object.
 * @param {string} type - Chart type ("bar" or "pie").
 * @param {string|string[]} [colors] - Color or array of colors for the chart.
 * @param {object} [style] - Custom style object for the chart container.
 * @param {object} [size] - Layout info, e.g., { width, height }.
 * @param {string|number} [id] - Widget id.
 */
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ChartWidget({
  id,
  title,
  data,
  options,
  type = "bar",
  style,
  size,
}) {
  // Example fallback data if none provided
  const defaultBarData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [120, 190, 170, 210, 250, 300],
        backgroundColor: "#6366f1",
      },
    ],
  };
  const defaultPieData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3],
        backgroundColor: ["#f87171", "#60a5fa", "#fbbf24"],
      },
    ],
  };
  // Determine dynamic style and size
  const chartStyle = { ...style, ...(size ? { width: size.width, height: size.height } : {}) };
  

  return (
    <div onClick={typeof (arguments[0]?.onClick) === "function" ? arguments[0].onClick : undefined} style={{ cursor: "pointer" }}>
      <div className="flex items-center gap-2 mb-2">
        {/* <span className="text-xs text-muted-foreground font-mono">ID: {id}</span>
        <span className="text-sm font-semibold">{title}</span> */}
      </div>
      <div style={chartStyle}>
        {type === "pie" ? (
          <Pie
            data={data || defaultPieData}
            options={options || { responsive: true, plugins: { legend: { position: "bottom" } } }}
          />
        ) : (
          <Bar
            data={data || defaultBarData}
            options={
              options || {
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { color: "#e5e7eb" } },
                },
              }
            }
          />
        )}
      </div>
    </div>
  );
}
