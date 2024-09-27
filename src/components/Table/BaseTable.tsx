import React, { useState } from "react";
import {
  ExtractKeys,
  SortOrder,
  SortString,
  TableColumnProps,
} from "./TableColumn";
import { Table } from "./Table";
import { TableHead } from "./TableHead";
import { TableRow } from "./TableRow";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableBody } from "./TableBody";
import { TableDataCell } from "./TableDataCell";
import { castToString } from "../../utils/helpers";
import { ArrowDown, ArrowUp, CaretUpDown } from "@phosphor-icons/react";
import { useRowSelection } from "./hooks/useRowSelection";
import { useTableSorting } from "./hooks/useTableSortings";
import { useExpandableRows } from "./hooks/useExpandableRows";
import { useTableColumns } from "./hooks/useTableColumns";

type Props<TData> = {
  children:
    | React.ReactElement<TableColumnProps<TData, unknown>>
    | React.ReactElement<TableColumnProps<TData, unknown>>[];
  data: TData[];
  sort: SortString<TData>;
  hasIndexColumn?: boolean;
  tableClassName?: string;
  onRowClick?: (data: TData) => void;
  onSortChange?: (sort: SortString<TData>) => void;
  selectedRows?: TData[];
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  expandableContent?: (rowData: TData) => React.ReactNode;
  rowActions?: (rowData: TData) => React.ReactNode;
};

const BaseTable = <TData,>({
  children,
  data,
  sort,
  hasIndexColumn,
  tableClassName,
  onSortChange,
  onRowClick,
  selectedRows = [],
  onRowSelectionChange,
  expandableContent,
  rowActions,
}: Props<TData>) => {
  const [localSelectedRows, setLocalSelectedRows] =
    useState<TData[]>(selectedRows);

  const { handleSortChange, sortedBy } = useTableSorting(sort, onSortChange);

  const { handleSelectAllRows, handleRowSelection } = useRowSelection(
    data,
    localSelectedRows,
    setLocalSelectedRows,
    onRowSelectionChange
  );

  const { expandedRows, toggleExpandRow } = useExpandableRows();

  const columns = useTableColumns({
    children,
    hasIndexColumn,
    data,
    localSelectedRows,
    handleSelectAllRows,
    handleRowSelection,
    onRowSelectionChange,
  });

  return (
    <Table
      className={`w-full overflow-hidden border-separate ${tableClassName}`}
      style={{ borderSpacing: 0 }}
    >
      <TableHead>
        <TableRow>
          {expandableContent && (
            <TableHeaderCell style={{ width: 50 }}></TableHeaderCell>
          )}
          {columns.map((column, index) => (
            <TableHeaderCell
              key={index}
              style={{
                textAlign: column.props.justify || "left",
                width:
                  typeof column.props.width === "number"
                    ? `${column.props.width}px`
                    : "auto",
              }}
            >
              <div
                onClick={() =>
                  column.props.sortable
                    ? handleSortChange(column.props.name)
                    : undefined
                }
                className={`flex gap-1 items-center ${
                  column.props.sortable
                    ? "hover:text-purple-600 cursor-pointer"
                    : ""
                }`}
              >
                {column.props.label || column.props.name}
                {column.props.sortable && (
                  <BaseTable.SortButton
                    sorting={
                      (sortedBy === column.props.name
                        ? (castToString(sort).split(
                            " "
                          )[1] as ExtractKeys<TData>)
                        : "unset") as SortOrder
                    }
                  />
                )}
              </div>
            </TableHeaderCell>
          ))}
          {rowActions && <TableHeaderCell style={{ textAlign: "right" }} />}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((rowData, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <TableRow
              className={`odd:bg-[#F7F6FE] bg-white hover:bg-purple-200 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                onRowClick?.(rowData);
                toggleExpandRow(rowIndex);
              }}
            >
              {expandableContent && (
                <TableDataCell>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandRow(rowIndex);
                    }}
                  >
                    {expandedRows.has(rowIndex) ? <ArrowUp /> : <ArrowDown />}
                  </span>
                </TableDataCell>
              )}
              {columns.map((column, colIndex) => (
                <TableDataCell
                  key={colIndex}
                  style={{
                    textAlign: column.props.justify || "left",
                    width:
                      typeof column.props.width === "number"
                        ? `${column.props.width}px`
                        : "auto",
                  }}
                >
                  {column.props.render(
                    column.props.name === "index" ||
                      column.props.name === "checkbox"
                      ? rowIndex
                      : column.props.valueSelector(rowData)
                  )}
                </TableDataCell>
              ))}
              {rowActions && (
                <TableDataCell style={{ textAlign: "right" }}>
                  {rowActions(rowData)}
                </TableDataCell>
              )}
            </TableRow>
            {expandedRows.has(rowIndex) && (
              <TableRow>
                <TableDataCell
                  className="border-b border-black"
                  colSpan={columns.length + 2}
                >
                  {expandableContent?.(rowData)}{" "}
                </TableDataCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default BaseTable;

const sortingIcons = {
  asc: <ArrowDown />,
  desc: <ArrowUp />,
  unset: <CaretUpDown />,
};

type SortButtonProps = {
  sorting: "asc" | "desc" | "unset";
};

BaseTable.SortButton = ({ sorting }: SortButtonProps) => (
  <button className="fill-black hover:fill-gray-500">
    {sortingIcons[sorting]}
  </button>
);
