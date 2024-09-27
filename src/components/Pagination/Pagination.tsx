import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface PaginationProps {
  skipCount: number;
  totalCount: number;
  rowsPerPage: number;
  onSetSkipCount: (skipCount: number) => void;
  onRowsPerPage: (rowsPerPage: number) => void;
}

const Pagination = ({
  skipCount = 0,
  totalCount = 0,
  rowsPerPage = 5,
  onRowsPerPage,
  onSetSkipCount,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const currentPage = Math.floor(skipCount / rowsPerPage) + 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onSetSkipCount((newPage - 1) * rowsPerPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center text-text-tertiary justify-between text-sm p-2 bg-transparent">
      <div className="flex items-center space-x-1">
        <label htmlFor="rowsPerPage">Rows per page:</label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPage(Number(e.target.value))}
          className="border rounded p-1"
        >
          {[5, 10, 15, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-1">
        <button
          className={`p-1 ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <CaretLeft className="text-text-secondary" />
        </button>
        {renderPageNumbers().map((number, index) =>
          number === "..." ? (
            <span key={index} className="p-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`p-1 ${
                number === currentPage
                  ? "bg-element-fill-9 text-text-primary font-semibold duration-100"
                  : "text-text-secondary"
              }`}
              onClick={() => handlePageChange(number as number)}
            >
              {number}
            </button>
          )
        )}
        <button
          className={`p-1 ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <CaretRight size={12} className="text-text-secondary" />
        </button>
      </div>
      <div>
        <span>
          {skipCount + 1}-{Math.min(skipCount + rowsPerPage, totalCount)} of{" "}
          {totalCount}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
