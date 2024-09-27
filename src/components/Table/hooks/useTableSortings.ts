import { useCallback } from "react";
import { ExtractKeys, SortOrder, SortString } from "../TableColumn";
import { castToString } from "../../../utils/helpers";

export const useTableSorting = <TData>(
  sort: SortString<TData>,
  onSortChange?: (sort: SortString<TData>) => void
) => {
  const handleSortChange = useCallback(
    (name: string) => {
      const currentSortField = castToString(sort).split(" ")[0];
      const currentSortOrder = castToString(sort).split(" ")[1] as SortOrder;

      const newSortOrder =
        currentSortField === name && currentSortOrder === "asc"
          ? "desc"
          : "asc";

      onSortChange?.(`${name} ${newSortOrder}` as SortString<TData>);
    },
    [sort, onSortChange]
  );

  const sortedBy = castToString(sort).split(" ")[0] as ExtractKeys<TData>;
  const sortOrder = castToString(sort).split(" ")[1] as SortOrder;

  return { handleSortChange, sortedBy, sortOrder };
};
