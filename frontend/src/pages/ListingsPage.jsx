import { useState, useEffect } from "react";
import api from "../api/client";
import LoadingCard from "../components/LoadingCard";
import ErrorCard from "../components/ErrorCard";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";

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

  const [filter, setFilter] = useState(DEFAULT_PARAMS);
  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(LIMIT);
  const [offsetPerPage, setOffsetPerPage] = useState(OFFSET);

  function updateFilter(tempFilter) {
    setFilter(tempFilter);
    setOffsetPerPage(OFFSET);
    setCurrentPage(1);
  }

  function clearFilter() {
    setFilter(DEFAULT_PARAMS);
    setOffsetPerPage(OFFSET);
    setCurrentPage(1);
  }

  function changePage(pageNumber) {
    setCurrentPage(pageNumber);
    setOffsetPerPage((pageNumber - 1) * LIMIT);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({
        limit: LIMIT,
        offset: offsetPerPage,
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
  }, [filter, offsetPerPage]);

  return (
    <>
      <div className="p-3 m-3">
        <h1 className="font-bold text-3xl border-b-3 pb-1 border-blue-900">
          Listing Page
        </h1>
        <PropertyFilters
          filterValues={filter}
          defaultParams={DEFAULT_PARAMS}
          updateFilter={updateFilter}
          clearFilter={clearFilter}
        />
        {loading && <LoadingCard />}
        {error && <ErrorCard error={errorMsg} />}
        {!loading && !error && properties?.results?.length > 0 && (
          <>
            <div className="py-3 my-3">
              Showing {properties?.offset + 1}-
              {properties?.limit + properties?.offset < properties?.total
                ? properties?.limit + properties?.offset
                : properties?.total}{" "}
              of {properties?.total} properties
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {properties?.results?.map((property) => (
                <PropertyCard key={property.ListingID} property={property} />
              ))}
            </div>
          </>
        )}

        {!loading && !error && properties?.results?.length === 0 && (
          <div className="mt-6">
            No properties found. Please adjust filter terms and try again.
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={LIMIT}
          totalItems={properties?.total}
          changePage={changePage}
          loading={loading}
        />
      </div>
    </>
  );
}