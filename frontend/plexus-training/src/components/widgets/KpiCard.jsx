/**
 * KpiCard displays a KPI value with customizable properties.
 *
 * Props:
 * @param {string} title - The title of the KPI.
 * @param {string|number} value - The value to display.
 * @param {React.ReactNode} [icon] - Optional icon to display.
 * @param {string|string[]} [colors] - Color or array of colors for the card.
 * @param {object} [style] - Custom style object for the Card.
 * @param {object} [size] - Layout info, e.g., { width, height }.
 * @param {string} [widgetName] - Name of the widget (default: "KpiCard").
 */
import { Card } from "../ui/card";
import { dummyKpiCardData } from "../../lib/utils";

export default function KpiCard({
  title,
  value,
  icon,
  label,
  widgetName = "KpiCard",
  style,
  size
}) {
  // Use dummy KPI data as fallback
  const cardStyle = { ...style, ...(size ? { width: size.width, height: size.height } : {}) };
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-tr from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 h-full text-center rounded-xl shadow min-h-[120px] select-none"
      style={cardStyle}
    >
      <div className="text-3xl text-primary mb-2">{icon || dummyKpiCardData.icon}</div>
      <div className="text-2xl font-bold mb-1">{value !== undefined ? value : dummyKpiCardData.value}</div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
        {title || dummyKpiCardData.title || widgetName}
      </div>
      <div className="text-xs text-gray-400">{label || dummyKpiCardData.label}</div>
    </div>
  );
}
