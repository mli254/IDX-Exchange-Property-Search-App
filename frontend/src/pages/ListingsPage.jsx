import { useState, useEffect } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

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

function ErrorCard({ error }) {
  return (
    <div className="w-96 m-auto mt-[5rem] p-2 text-red-600 text-center box border-red-400 border-2">
      <p className="text-3xl font-bold capitalize">Status: {error.status}</p>
      <p>{error.error}</p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div>
      <h2 className="text-center text-4xl pt-[15rem] font-bold align-middle">
        Loading...
      </h2>
    </div>
  );
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

  function updateFilter(tempFilter) {
    setFilter(tempFilter);
  }

  function clearFilter() {
    setFilter(DEFAULT_PARAMS);
  }

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({
        limit: LIMIT,
        offset: OFFSET,
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
  }, [filter]);

  return (
    <>
      <div className="p-3 m-3">
        <h1 className="font-bold text-3xl border-b-3 pb-1 border-blue-900">
          Listing Page
        </h1>
        <div>
          <PropertyFilters
            filterValues={filter}
            defaultParams={DEFAULT_PARAMS}
            updateFilter={updateFilter}
            clearFilter={clearFilter}
          />
        </div>
        {loading && <LoadingCard />}
        {error && <ErrorCard error={errorMsg} />}

        {!loading && !error && properties?.results?.length > 0 && (
          <>
            <div className="py-3 my-3">
              Showing {properties?.offset}-
              {properties?.limit < properties?.total
                ? properties?.limit + properties?.offset
                : properties?.total}{" "}
              of {properties?.total} properties
            </div>
            <div className="grid grid-cols-4 gap-4">
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
      </div>
    </>
  );
}
