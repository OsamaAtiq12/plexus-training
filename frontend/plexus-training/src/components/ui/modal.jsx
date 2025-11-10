import * as React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 min-w-[320px] max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          &times;
        </button>
        {title && <div className="text-lg font-semibold mb-4">{title}</div>}
        {children}
      </div>
    </div>
  );
}
