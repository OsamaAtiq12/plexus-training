/**
 * TableWidget displays a table with customizable properties.
 *
 * Props:
 * @param {string} title - The title of the table.
 * @param {string[]} columns - Array of column names.
 * @param {object[]} data - Array of row objects.
 * @param {string|string[]} [colors] - Color or array of colors for the card.
 * @param {object} [style] - Custom style object for the Card.
 * @param {object} [size] - Layout info, e.g., { width, height }.
 * @param {string} [widgetName] - Name of the widget (default: "TableWidget").
 */
import { Card } from "../ui/card";

export default function TableWidget({
  id,
  title,
  columns,
  data,
  colors,
  style,
  size,
  widgetName = "TableWidget",
  onClick
}) {
  // Determine dynamic style and size
  const cardStyle = { ...style, ...(size ? { width: size.width, height: size.height } : {}) };

  return (
    <Card className="p-4" style={cardStyle} onClick={typeof onClick === "function" ? onClick : undefined}>
      <div className="text-xs text-gray-400 mb-1">ID: <span className="font-mono">{id}</span></div>
      <div className="text-xs text-muted-foreground mb-1">Widget: <span className="font-mono">{widgetName}</span></div>
      <div className="text-sm font-semibold mb-2">{title}</div>
      {colors && (
        <div className="mb-2 flex gap-2 items-center">
          <span className="text-xs">Colors:</span>
          {Array.isArray(colors)
            ? colors.map((c, i) => (
                <span key={i} style={{ background: c, width: 16, height: 16, display: "inline-block", borderRadius: 4, border: "1px solid #ccc" }} title={c}></span>
              ))
            : <span style={{ background: colors, width: 16, height: 16, display: "inline-block", borderRadius: 4, border: "1px solid #ccc" }} title={colors}></span>
          }
        </div>
      )}
      {size && (
        <div className="mb-2 text-xs text-gray-500">Size: {size.width} x {size.height}</div>
      )}
      {style && (
        <div className="mb-2 text-xs text-gray-500">Style: {JSON.stringify(style)}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-2 py-1 text-left text-muted-foreground font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                {columns.map((col) => (
                  <td key={col} className="px-2 py-1">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
