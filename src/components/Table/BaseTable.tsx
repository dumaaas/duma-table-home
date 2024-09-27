import React, { useCallback, useEffect, useState } from "react";
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
  expandableContent?: (rowData: TData) => React.ReactNode; // Funkcija za ekspanzibilni sadržaj
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
}: Props<TData>) => {
  const [localSelectedRows, setLocalSelectedRows] =
    useState<TData[]>(selectedRows);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const areRowsDifferent =
      selectedRows.length !== localSelectedRows.length ||
      selectedRows.some((row, index) => row !== localSelectedRows[index]);

    if (areRowsDifferent) {
      setLocalSelectedRows(selectedRows);
    }
  }, [selectedRows, localSelectedRows]);

  let columns = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  ) as React.ReactElement<TableColumnProps<TData, unknown>>[];

  // Dodajemo indeksnu kolonu ako je omogućeno
  if (hasIndexColumn) {
    columns = [
      {
        props: {
          name: "index",
          label: "#",
          width: 100,
          render: (index: number) => index + 1,
          valueSelector: () => undefined,
        },
      } as unknown as React.ReactElement<TableColumnProps<TData, unknown>>,
      ...columns,
    ];
  }

  // Dodajemo checkbox kolonu ako je `onRowSelectionChange` definisan
  if (onRowSelectionChange) {
    columns = [
      {
        props: {
          name: "checkbox",
          label: (
            <input
              type="checkbox"
              checked={localSelectedRows.length === data.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocalSelectedRows(data);
                  onRowSelectionChange(data);
                } else {
                  setLocalSelectedRows([]);
                  onRowSelectionChange([]);
                }
              }}
            />
          ),
          render: (rowIndex: number) => (
            <input
              type="checkbox"
              checked={localSelectedRows.some((row) => row === data[rowIndex])}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                let updatedSelectedRows: TData[] = [...localSelectedRows];
                const row = data[rowIndex];

                if (e.target.checked) {
                  updatedSelectedRows.push(row);
                } else {
                  updatedSelectedRows = updatedSelectedRows.filter(
                    (selectedRow) => selectedRow !== row
                  );
                }

                setLocalSelectedRows(updatedSelectedRows);
                onRowSelectionChange(updatedSelectedRows);
              }}
            />
          ),
          valueSelector: () => undefined,
        },
      } as unknown as React.ReactElement<TableColumnProps<TData, unknown>>,
      ...columns,
    ];
  }

  const handleSortChange = useCallback(
    (name: string) => {
      const order = castToString(sort).split(" ")[1] as ExtractKeys<TData>;
      const newSort = `${String(name)} ${
        order === "asc" ? "desc" : "asc"
      }` as SortString<TData>;

      onSortChange?.(newSort);
    },
    [sort, onSortChange]
  );

  const sortedBy = castToString(sort).split(" ")[0] as ExtractKeys<TData>;

  const toggleExpandRow = (rowIndex: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.add(rowIndex);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <Table
      className={`w-full overflow-hidden border-separate ${tableClassName}`}
      style={{ borderSpacing: 0 }}
    >
      <TableHead>
        <TableRow>
          {/* Prikazujemo prazan string za kolonu ekspanzije ako je prosleđena */}
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
                toggleExpandRow(rowIndex); // Toggle expand row
              }}
            >
              {/* Ikona za ekspanziju, prikazuje se samo ako je prosleđena expandableContent */}
              {expandableContent && (
                <TableDataCell>
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
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
            </TableRow>
            {expandedRows.has(rowIndex) && (
              <TableRow >
                <TableDataCell className="border-b border-black" colSpan={columns.length + 1}>
                  {expandableContent?.(rowData)}{" "}
                  {/* Render expandable content */}
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
