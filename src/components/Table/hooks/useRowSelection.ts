import { useCallback } from "react";

export const useRowSelection = <TData>(
  data: TData[],
  localSelectedRows: TData[],
  setLocalSelectedRows: (rows: TData[]) => void,
  onRowSelectionChange?: (selectedRows: TData[]) => void
) => {
  const handleSelectAllRows = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allSelected = e.target.checked;
      const updatedSelectedRows = allSelected ? data : [];
      setLocalSelectedRows(updatedSelectedRows);
      onRowSelectionChange?.(updatedSelectedRows);
    },
    [data, setLocalSelectedRows, onRowSelectionChange]
  );

  const handleRowSelection = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
      const row = data[rowIndex];
      const updatedSelectedRows = e.target.checked
        ? [...localSelectedRows, row]
        : localSelectedRows.filter((selectedRow) => selectedRow !== row);

      setLocalSelectedRows(updatedSelectedRows);
      onRowSelectionChange?.(updatedSelectedRows);
    },
    [data, localSelectedRows, setLocalSelectedRows, onRowSelectionChange]
  );

  return { handleSelectAllRows, handleRowSelection };
};
