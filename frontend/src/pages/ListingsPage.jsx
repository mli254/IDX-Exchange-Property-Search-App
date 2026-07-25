import { useState, useEffect } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";

function ErrorCard({ error }) {
  return (
    <div className="w-96 m-auto mt-[5rem] p-2 text-red-600 text-center box border-red-400 border-2">
      <p className="text-3xl font-bold">Status: {error.status}</p>
      <p>{error.error}</p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div>
      <h2 className="text-center text-4xl pt-[15rem] font-bold align-middle">Loading...</h2>
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

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({
        limit: LIMIT,
        offset: OFFSET,
      });
      if (response.error) {
        setError(true);
        setErrorMsg(response);
      } else {
        setProperties(response);
      }

      setLoading(false);
    };

    loadProperties();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return <ErrorCard error={errorMsg} />;
  }

  return (
    <>
      <div className="p-3 m-3">
        <h1 className="font-bold text-3xl border-b-3 pb-1 border-blue-900">Listing Page</h1>
          <div className="py-3 my-3">
            Showing {properties?.offset}-{properties?.limit+properties?.offset} of {properties?.total} properties
          </div>
          <div className="grid grid-cols-4 gap-4">
            {properties?.results?.map((property) => (
              <PropertyCard key={property.ListingID} property={property} />
            ))}
          </div>
      </div>
    </>
  );
}
