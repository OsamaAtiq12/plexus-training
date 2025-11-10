import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Dummy sales data for widgets
export const dummyBarChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales",
      data: [15000, 21000, 18000, 24000, 27000, 32000],
      backgroundColor: "#6366f1",
    },
  ],
};

export const dummyPieChartData = {
  labels: ["Electronics", "Clothing", "Home & Kitchen"],
  datasets: [
    {
      label: "Sales by Category",
      data: [35000, 22000, 18000],
      backgroundColor: ["#60a5fa", "#fbbf24", "#34d399"],
    },
  ],
};

export const dummyTableColumns = ["Product", "Units Sold", "Revenue"];
export const dummyTableData = [
  { Product: "Laptop", "Units Sold": 120, Revenue: "$96,000" },
  { Product: "Smartphone", "Units Sold": 200, Revenue: "$110,000" },
  { Product: "Headphones", "Units Sold": 150, Revenue: "$15,000" },
  { Product: "Monitor", "Units Sold": 80, Revenue: "$24,000" },
];

/**
 * Multiple dummy KPI card data for sales
 */
export const dummyKpiCardsData = [
  {
    value: 12345,
    title: "Total Sales",
    icon: "📈",
    label: "SALES"
  },
  {
    value: 320,
    title: "Orders",
    icon: "🛒",
    label: "ORDERS"
  },
  {
    value: 98,
    title: "New Customers",
    icon: "👤",
    label: "CUSTOMERS"
  },
  {
    value: 87,
    title: "Refunds",
    icon: "↩️",
    label: "REFUNDS"
  }
];

// Dummy KPI card data for sales (single, for backward compatibility)
export const dummyKpiCardData = dummyKpiCardsData[0];
