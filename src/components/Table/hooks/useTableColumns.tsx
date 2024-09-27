import { useMemo } from "react";
import React from "react";
import { TableColumnProps } from "../TableColumn";

type UseTableColumnsProps<TData> = {
  children:
    | React.ReactElement<TableColumnProps<TData, unknown>>
    | React.ReactElement<TableColumnProps<TData, unknown>>[];
  hasIndexColumn?: boolean;
  data: TData[];
  localSelectedRows: TData[];
  handleSelectAllRows: (e: React.ChangeEvent<HTMLInputElement>) => void; // Dodajemo očekivani argument
  handleRowSelection: (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number
  ) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
};

export function useTableColumns<TData>({
  children,
  hasIndexColumn,
  data,
  localSelectedRows,
  handleSelectAllRows,
  handleRowSelection,
  onRowSelectionChange,
}: UseTableColumnsProps<TData>) {
  const childArray = React.Children.toArray(children) as React.ReactElement<
    TableColumnProps<TData, unknown>
  >[];

  return useMemo(() => {
    let baseColumns = childArray.filter(
      React.isValidElement
    ) as React.ReactElement<TableColumnProps<TData, unknown>>[];

    if (hasIndexColumn) {
      baseColumns = [
        {
          props: {
            name: "index",
            label: "#",
            width: 50,
            render: (index: number) => index + 1,
            valueSelector: () => undefined,
          },
        } as unknown as React.ReactElement<TableColumnProps<TData, unknown>>,
        ...baseColumns,
      ];
    }

    if (onRowSelectionChange) {
      baseColumns = [
        {
          props: {
            name: "checkbox",
            width: 50,
            label: (
              <input
                type="checkbox"
                checked={localSelectedRows.length === data.length}
                onChange={handleSelectAllRows} // Ovo će biti rešen problem dole
              />
            ),
            render: (rowIndex: number) => (
              <input
                type="checkbox"
                checked={localSelectedRows.includes(data[rowIndex])}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleRowSelection(e, rowIndex)}
              />
            ),
            valueSelector: () => undefined,
          },
        } as unknown as React.ReactElement<TableColumnProps<TData, unknown>>,
        ...baseColumns,
      ];
    }

    return baseColumns;
  }, [
    childArray,
    hasIndexColumn,
    onRowSelectionChange,
    data,
    localSelectedRows,
  ]);
}
