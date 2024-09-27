import React from "react";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={`w-full min-w-[900px] rounded-lg ${className}`}
      {...props}
    />
  </div>
));
