import React from "react";

const Field = ({ label, hint, children }) => (
  <label className="flex w-full flex-col gap-1.5">
    <span className="text-sm font-medium">{label}</span>
    {children}
    {hint && <span className="text-xs text-base-content/60">{hint}</span>}
  </label>
);

export default Field;
