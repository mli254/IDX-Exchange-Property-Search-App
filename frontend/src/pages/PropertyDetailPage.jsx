import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/client";
import LoadingCard from "../components/LoadingCard";
import ErrorCard from "../components/ErrorCard";
import OpenHouseDetail from "../components/OpenHouseDetail";
import * as helper from "../utils/helper";


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
        <div className="flex flex-col">
          <p className="w-[100%] h-80 bg-gray-200">Images Here</p>
          <div className="box w-200 m-auto mt-10 mb-5 px-5 py-3 rounded-lg shadow-sm shadow-gray-400 border-1 border-gray-200">
            <h2 className="font-[700] text-4xl">
              {helper.formatPrice(propertyDetail.results[0].L_SystemPrice) ||
                "—"}
            </h2>
            <div className="pb-2 text-md text-gray-500">
              <p>
                {propertyDetail.results[0].L_Address ? (
                  propertyDetail.results[0].L_Address + ", "
                ) : (
                  <p>
                    <strong>Address:</strong> N/A
                  </p>
                )}
                {helper.formatLocation(
                  propertyDetail.results[0].L_City,
                  propertyDetail.results[0].L_State,
                  propertyDetail.results[0].L_Zip,
                )}
              </p>
            </div>
            <p className="text-xl">
              <strong>
                {Math.floor(propertyDetail.results[0].L_Keyword2) || "-"}
              </strong>{" "}
              beds{" | "}
              <strong>
                {Math.floor(propertyDetail.results[0].LM_Dec_3) || "-"}
              </strong>{" "}
              baths{" | "}
              <strong>
                {helper.formatSQFT(propertyDetail.results[0].LM_Int2_3) || "-"}
              </strong>{" "}
              sqft
            </p>
            {propertyDetail.results[0].YearBuilt && (
              <p className="mt-3 p-2 bg-gray-300 font-[600] text-gray-700 rounded-lg">
                Built in {propertyDetail.results[0].YearBuilt}
              </p>
            )}
          </div>
          <div className="box w-200 m-auto my-1 px-5 pt-3 pb-5 rounded-lg shadow-sm shadow-gray-400 border-1 border-gray-200">
            <h2 className="font-[700] text-2xl mb-3">About</h2>
            <p>
              {propertyDetail.results[0].L_Remarks ||
                "Description unavailable."}
            </p>
          </div>
          <div className="box w-200 m-auto my-5 px-5 py-3 rounded-lg shadow-sm shadow-gray-400 border-1 border-gray-200">
            <h2 className="font-[700] text-2xl mb-3">Openhouse Events</h2>
            {propertyOpenhouses?.openhouses?.length > 0 ? (
              propertyOpenhouses.openhouses.map((openhouse) => (
                <OpenHouseDetail key={openhouse.L_ListingID} openhouse={openhouse}/>
              ))
            ) : (
              <p>No open houses scheduled.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
