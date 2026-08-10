function generatePageNumbers(currentPage, totalPages, itemsPerPage) {
    const MAX_VISIBLE_PAGES = itemsPerPage;
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
            pageNumbers.push(1)
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

export default function Pagination({currentPage, itemsPerPage, totalItems, changePage}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
    <>
    <nav className="border p-5">
        <button
        className="font-bold border rounded-lg px-2 disabled:text-gray-300"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage===1}>
            Previous
        </button>

        {generatePageNumbers(currentPage, totalPages).map((pageNumber, index) => (
            <button
            className="font-bold border rounded-lg px-2 disabled:text-gray-300"
            key={index}
            onClick={() => changePage(pageNumber)}
            disabled={pageNumber==="..."}
            >
                {pageNumber}
            </button>
        ))}

        <button
        className="font-bold border rounded-lg px-2 disabled:text-gray-300"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage===totalPages}
        >
            Next
        </button>
    </nav>
    </>
    );
}