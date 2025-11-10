/**
 * Reusable Error component for displaying error messages.
 * @param {string} message - The error message to display
 * @param {string} className - Additional classes
 * @param {ReactNode} children - Optional custom content
 */
export default function Error({ message, className = "", children }) {
  return (
    <div
      className={`mb-4 text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2 ${className}`}
      role="alert"
    >
      {message || children}
    </div>
  );
}
