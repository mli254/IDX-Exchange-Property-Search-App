function generatePageNumbers(currentPage, totalPages) {
  const MAX_VISIBLE_PAGES = 7;
  const pageNumbers = [];

  // show all pages if less than the number allowed to be visible at once
  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
  }

  return pageNumbers;
}

export default function Pagination({
  currentPage,
  itemsPerPage,
  totalItems,
  changePage,
  loading,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <nav
        role="navigation"
        className={`${totalPages === 1 ? "hidden" : "flex justify-center items-center gap-2 border border-gray-300 rounded-md p-3 mt-5"}`}
      >
        <button
          className="font-bold text-white bg-blue-900 rounded-lg px-2 mx-1 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-sky-700"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1 || loading || totalItems === 0}
        >
          Previous
        </button>

        {generatePageNumbers(currentPage, totalPages).map(
          (pageNumber, index) => (
            <button
              className={`font-bold rounded-lg px-2 ${
                pageNumber === "..."
                  ? "text-gray-300 cursor-default"
                  : pageNumber === currentPage
                    ? "bg-blue-900 text-white"
                    : loading
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:text-sky-700"
              }`}
              key={index}
              onClick={() => changePage(pageNumber)}
              disabled={pageNumber === "..." || loading}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          className="font-bold text-white bg-blue-900 rounded-lg px-2 mx-1 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-sky-700"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages || loading || totalItems === 0}
        >
          Next
        </button>
      </nav>
    </>
  );
}
