import { useState, useCallback } from "react";

export const useExpandableRows = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpandRow = useCallback((rowIndex: number) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(rowIndex)) {
        newExpandedRows.delete(rowIndex);
      } else {
        newExpandedRows.add(rowIndex);
      }
      return newExpandedRows;
    });
  }, []);

  return { expandedRows, toggleExpandRow };
};
