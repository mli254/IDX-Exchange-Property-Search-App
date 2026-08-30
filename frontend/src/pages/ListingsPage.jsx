import { useState, useEffect } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import api from "../api/client";
import LoadingCard from "../components/LoadingCard";
import ErrorCard from "../components/ErrorCard";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";

// removes any params with empty values and trims string params
function cleanParams(filter) {
  for (let [key, value] of Object.entries(filter)) {
    if (!value) {
      continue;
    }
    if (typeof value === String) {
      filter[key] = value.trim;
    }
  }
  return filter;
}

export default function ListingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [properties, setProperties] = useState(null);

  const LIMIT = 20;
  const OFFSET = 0;
  const DEFAULT_PARAMS = {
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  };
  const DEFAULT_SORT = {
    sortBy: "default",
    sortOrder: "asc",
  };

  const [filter, setFilter] = useState(DEFAULT_PARAMS);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [offsetPerPage, setOffsetPerPage] = useState(OFFSET);

  function updateFilter(tempFilter) {
    setFilter(tempFilter);
    setSort(DEFAULT_SORT);
    setOffsetPerPage(OFFSET);
    setCurrentPage(1);
  }

  function clearFilter() {
    setFilter(DEFAULT_PARAMS);
    setSort(DEFAULT_SORT);
    setOffsetPerPage(OFFSET);
    setCurrentPage(1);
  }

  function changePage(pageNumber) {
    setCurrentPage(pageNumber);
    setOffsetPerPage((pageNumber - 1) * LIMIT);
    window.scrollTo(0, 0);
  }

  function changeSortBy(event) {
    const { name, value } = event.target;
    setSort((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function changeSortOrder() {
    const newOrder = sort.sortOrder === "asc" ? "desc" : "asc";
    setSort((prevState) => ({
      ...prevState,
      sortOrder: newOrder,
    }));
  }

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({
        limit: LIMIT,
        offset: offsetPerPage,
        ...sort,
        ...cleanParams(filter),
      });
      if (response.error) {
        setError(true);
        setErrorMsg(response);
      } else {
        setProperties(response);
        setError(false);
      }

      setLoading(false);
    };

    loadProperties();
  }, [offsetPerPage, sort, filter]);

  return (
    <>
      <div className="p-3 m-3">
        <h1 className="font-bold text-3xl border-b-3 pb-1 border-blue-900">
          Listing Page
        </h1>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div className="w-96 m-auto my-[5rem] p-2 text-red-600 text-center border-red-400 border-2">
              <p className="text-2xl font-bold">Something Went Wrong</p>
              <pre>Error Message: {getErrorMessage(error)}</pre>
            </div>
          )}
        >
          <PropertyFilters
            filterValues={filter}
            defaultParams={DEFAULT_PARAMS}
            updateFilter={updateFilter}
            clearFilter={clearFilter}
          />
        </ErrorBoundary>
        {loading && <LoadingCard />}
        {error && <ErrorCard error={errorMsg} />}
        {!loading && !error && properties?.results?.length > 0 && (
          <>
            <ErrorBoundary
              fallbackRender={({ error }) => (
                <div className="w-96 m-auto my-[5rem] p-2 text-red-600 text-center border-red-400 border-2">
                  <p className="text-2xl font-bold">Something Went Wrong</p>
                  <pre>Error Message: {getErrorMessage(error)}</pre>
                </div>
              )}
            >
              <div className="py-3 my-3 flex gap-5 justify-between">
                <div>
                  {/* 
                    Shows current position in listings:
                    - starts at listing "1", so converts offset from being 0-based using "offset + 1"
                    - ends at either the limit + the current offset, or the total amount of properties if there
                      are less than limit elements on a page
                  */}
                  Showing {properties?.offset + 1}-
                  {properties?.limit + properties?.offset < properties?.total
                    ? properties?.limit + properties?.offset
                    : properties?.total}{" "}
                  of {properties?.total} properties
                </div>
                <div className="flex gap-2 items-center">
                  <span>Sort: </span>
                  <select
                    name="sortBy"
                    value={sort.sortBy}
                    onChange={(event) => changeSortBy(event)}
                    className="text-center text-blue-900 font-bold"
                  >
                    <option value="default">Default</option>
                    <option value="price">Price</option>
                    <option value="date-listed">Date Listed</option>
                    <option value="square-footage">Square Footage</option>
                    <option value="beds">Number of Beds</option>
                  </select>
                  <button
                    onClick={changeSortOrder}
                    className="text-white font-bold bg-blue-900 p-1 pt-0 pr-2 rounded-lg cursor-pointer"
                  >
                    &#8645;{" "}
                    {sort.sortOrder === "asc" ? "Ascending" : "Descending"}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {properties?.results?.map((property) => (
                  <PropertyCard key={property.ListingID} property={property} />
                ))}
              </div>
            </ErrorBoundary>
          </>
        )}

        {!loading && !error && properties?.results?.length === 0 && (
          <div className="mt-6">
            No properties found. Please adjust filter terms and try again.
          </div>
        )}
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div className="w-96 m-auto my-[5rem] p-2 text-red-600 text-center border-red-400 border-2">
              <p className="text-2xl font-bold">Something Went Wrong</p>
              <pre>Error Message: {getErrorMessage(error)}</pre>
            </div>
          )}
        >
          <Pagination
            currentPage={currentPage}
            itemsPerPage={LIMIT}
            totalItems={properties?.total}
            changePage={changePage}
            loading={loading}
          />
        </ErrorBoundary>
      </div>
    </>
  );
}