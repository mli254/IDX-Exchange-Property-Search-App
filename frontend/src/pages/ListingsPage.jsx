import { useState, useEffect } from "react";
import api from "../api/client.js";
// import PropertyCard from '../components/PropertyCard'

function ErrorCard({errMsg}) {
    return (
        <>
        <p>An error occured.</p>
        <p className="text-red-600">{errMsg}</p>
        </>
    )
}

export default function ListingsPage() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [singleProperty, setSingleProperty] = useState([]);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({ limit: 5, offset: 5 });
      if (response) {
        setProperties(response);
      }

      setLoading(false);
    };

    loadProperties();
  }, []);

  useEffect(() => {
    const loadSingleProperty = async () => {
      setLoading(true);

      const response = await api.fetchPropertyDetail("1118422731");
      if (response) {
        setSingleProperty(response);
      }

      setLoading(false);
    };

    loadSingleProperty();
  }, []);

  return (
    <>
      {loading ? (
        <h2 className="text-center font-bold align-middle">Loading...</h2>
      ) : (
        <div className="font-bold">
        {properties.message ? (
                <ErrorCard errMsg={properties.message}/>
        ) : (
            <>
                <p>{JSON.stringify(properties)}</p>
                <p>{JSON.stringify(singleProperty)}</p>
            </>
        )}
        </div>
      )}
    </>
  );
}
