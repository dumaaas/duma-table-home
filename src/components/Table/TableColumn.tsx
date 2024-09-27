import { PropsWithChildren, ReactNode } from "react";

export type ExtractKeys<T> = T extends infer G ? `${string & keyof G}` : never;
export type SortOrder = "asc" | "desc";
export type SortString<T> = `${ExtractKeys<T>} ${SortOrder}`;

export type TableColumnJustify = "left" | "center" | "right";
export interface TableColumnProps<TDto, TValue> {
  name: string;
  width: number | "*";
  render: (value?: TValue) => ReactNode;
  label?: React.ReactNode;
  valueSelector: (rowData: TDto) => TValue | undefined;
  sortable?: boolean;
  justify?: TableColumnJustify;
  rowActions?: boolean;
}

export function TableColumn<TDto, TValue>(
  // We'll see how to refactor this unused component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: PropsWithChildren<TableColumnProps<TDto, TValue>>
) {
  return null;
}
