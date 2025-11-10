/**
 * Reusable Heading component.
 * @param {string} level - Heading level (1-6), default 2
 * @param {string} className - Additional classes
 * @param {ReactNode} children - Heading text/content
 */
export default function Heading({ level = 2, className = "", children }) {
  const Tag = `h${level}`;
  return (
    <Tag
      className={`font-bold tracking-tight ${level === 1 ? "text-4xl" : level === 2 ? "text-2xl" : "text-xl"} ${className}`}
    >
      {children}
    </Tag>
  );
}
