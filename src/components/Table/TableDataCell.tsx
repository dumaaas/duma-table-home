import React from "react";

export const TableDataCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={`px-2 py-2 ${className}`} {...props} />
));
