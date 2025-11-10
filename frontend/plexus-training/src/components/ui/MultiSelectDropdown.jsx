import React, { useState, useRef, useEffect } from "react";

/**
 * Reusable MultiSelectDropdown component.
 * 
 * Props:
 * - options: Array<{ label: string, value: string|number }>
 * - value: Array<string|number>
 * - onChange: (selected: Array<string|number>) => void
 * - label?: string
 * - placeholder?: string
 * - className?: string
 */
export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  function toggleOption(optionValue) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-left focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate text-gray-900 dark:text-gray-100">
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : <span className="text-gray-400">{placeholder}</span>}
        </span>
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-400 text-sm">No options</div>
          ) : (
            options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                  className="mr-2 accent-indigo-500"
                />
                <span>{opt.label}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}
