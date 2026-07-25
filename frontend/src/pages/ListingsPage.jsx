import { useState, useEffect } from "react";
import api from "../api/client.js";
import PropertyCard from '../components/PropertyCard'

function ErrorCard({ errMsg }) {
  return (
    <>
      <p className="text-red-600">{errMsg}</p>
    </>
  );
}

export default function ListingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [properties, setProperties] = useState(null);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({ limit: 5, offset: 0 });
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



  return (
    <>
      {loading ? (
        <h2 className="text-center font-bold align-middle">Loading...</h2>
      ) : (
        <div className="font-bold">
            {error ? (
                <>
                    <p>Status: {errorMsg.status}</p>
                    <ErrorCard errMsg={errorMsg.error} />
                </>
            )  : (
                <>
                <div>
                    Showing {properties.results.length} of {properties.total}
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {properties?.results?.map(property => (
                        <PropertyCard
                            key={property.ListingID}
                            property={property}
                        />
                    ))}
                </div>
                </>
            )}
        </div>
      )}
    </>
  );
}
