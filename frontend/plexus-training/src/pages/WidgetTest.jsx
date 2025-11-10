import KpiCard from "../components/widgets/KpiCard";
import ChartWidget from "../components/widgets/ChartWidget";
import TableWidget from "../components/widgets/TableWidget";

export default function WidgetTest() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex flex-col gap-8 items-center">
      <h1 className="text-3xl font-bold mb-4">Widget Test Page</h1>
      <div className="flex gap-8 flex-wrap">
        <KpiCard
          title="Revenue"
          value="$12,500"
          icon="💰"
          colors={["#34d399", "#fbbf24"]}
          style={{ background: "linear-gradient(90deg, #34d399 0%, #fbbf24 100%)" }}
          size={{ width: 250, height: 180 }}
          widgetName="KpiCard"
        />
        <ChartWidget
          title="Monthly Users"
          type="bar"
          colors={["#6366f1", "#f87171"]}
          style={{ border: "2px solid #6366f1" }}
          size={{ width: 400, height: 350 }}
          widgetName="ChartWidget"
        />
        <TableWidget
          title="Top Products"
          columns={["Product", "Sales"]}
          data={[
            { Product: "Widget A", Sales: 120 },
            { Product: "Widget B", Sales: 95 },
            { Product: "Widget C", Sales: 80 },
          ]}
          colors="#60a5fa"
          style={{ border: "2px solid #60a5fa" }}
          size={{ width: 350, height: 220 }}
          widgetName="TableWidget"
        />
      </div>
    </div>
  );
}
