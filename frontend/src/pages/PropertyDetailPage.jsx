import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/client";
import LoadingCard from "../components/LoadingCard";
import ErrorCard from "../components/ErrorCard";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [propertyDetail, setPropertyDetail] = useState([]);
  const [propertyOpenhouses, setPropertyOpenhouses] = useState([]);

  useEffect(() => {
    const loadPropertyDetail = async () => {
      setLoading(true);

      const response = await api.fetchPropertyDetail(id);
      if (response.error) {
        setError(true);
        setErrorMsg(response);
      } else {
        setPropertyDetail(response);
        setError(false);
      }

      setLoading(false);
    };

    loadPropertyDetail();
  }, [id]);

  useEffect(() => {
    const loadOpenhouses = async () => {
      setLoading(true);

      const response = await api.fetchPropertyOpenhouses(id);
      if (response.error) {
        setError(true);
        setErrorMsg(response);
      } else {
        setPropertyOpenhouses(response);
        setError(false);
      }

      setLoading(false);
    };

    loadOpenhouses();
  }, [id]);

  // price, address, beds, baths, sqft, year built, description, property details, open houses 
  return (
    <div className="p-3 m-3">
        <h1 className="font-bold text-3xl border-b-3 pb-1 border-blue-900">
            Property Detail
        </h1>
      {loading && <LoadingCard />}
      {error && <ErrorCard error={errorMsg} />}
      {!loading && !error && propertyDetail?.results && (
        <div>
          <p>Images Here</p>
          <h2>{propertyDetail.results[0].L_SystemPrice}</h2>
          {propertyOpenhouses?.openhouses?.length > 0 && (
            <div>
                {propertyOpenhouses?.openhouses[0].OpenHouseDate}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
