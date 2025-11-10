/**
 * Reusable DataTable component.
 * @param {Array} columns - Array of { header, accessor, render? }
 * @param {Array} data - Array of row objects
 */
export default function DataTable({ columns, data }) {
  return (
    <table className="min-w-full bg-white dark:bg-slate-900 rounded shadow border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor} className="px-4 py-2 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-2 text-center text-slate-400">
              No data
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-slate-100 dark:hover:bg-slate-800">
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
