import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/client";
import LoadingCard from "../components/LoadingCard";
import ErrorCard from "../components/ErrorCard";
import OpenHouseDetail from "../components/OpenHouseDetail";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
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

  const property = propertyDetail?.results?.[0];
  const photos = helper.parsePhotos(property?.L_Photos);
  const details = [];
  // const features = [];

  if (property) {
    // checking for property details like property type, year built, lot size, garage spaces, and flooring type
    if (property.L_Type_) {
      details.push({
        desc: "Property Type",
        value: helper.parseCamelCase(property.L_Type_),
      });
    } else if (property.L_Class) {
      details.push({
        desc: "Property Type",
        value: property.L_Class,
      });
    }

    if (property.StoriesTotal) {
      details.push({
        desc: "Levels",
        value: property.StoriesTotal,
      });
    } else if (property.L_Keyword7) {
      details.push({
        desc: "Levels",
        value: helper.parseCamelCase(property.L_Keyword7),
      });
    }

    if (property.YearBuilt) {
      details.push({
        desc: "Year Built",
        value: property.YearBuilt,
      });
    }

    if (property.L_Keyword1) {
      const lotSize = helper.formatNumber(parseInt(property.L_Keyword1));
      if (lotSize) {
        details.push({
          desc: "Lot Size",
          value: `${lotSize} sqft`,
        });
      }
    }

    if (property.L_Keyword5) {
      details.push({
        desc: "Parking",
        value: `${property.L_Keyword5} Car Garage`,
      });
    }

    if (property.Flooring) {
      details.push({
        desc: "Flooring Type",
        value: `${helper.parseCommas(property.Flooring)}`,
      });
    }

    // console.log(details);
    // move flooring into property details
    // possible additional above:
    // heating type, cooling type, interior features, fireplace, appliances,
    // structure type, patio features, roof type, fencing,
    // checking for y/n fields, e.g. private pool, attached garage, view type newly constructed
    // maybe: high school district
  }

  return (
    <div className="p-3 m-3">
      <h1 className="font-bold text-3xl border-b-3 pb-1 border-blue-900">
        Property Detail
      </h1>
      {loading && <LoadingCard />}
      {error && <ErrorCard error={errorMsg} />}
      {!loading && !error && propertyDetail?.results && (
        <div className="flex flex-col">
          <PropertyImageGallery imageArray={photos} />
          <div className="w-full sm:w-[90%] md:w-[60%] m-auto my-5 px-5 py-5 rounded-lg bg-white border-2 border-gray-200">
            {property.L_Status && (
              <p className="my-2">
                <span className="bg-blue-200 rounded-md px-2 py-1 font-bold text-gray-600 text-sm">
                  FOR SALE
                </span>
              </p>
            )}
            <h2 className="font-[700] text-2xl sm:text-4xl">
              {helper.formatPrice(property.L_SystemPrice) || "—"}
            </h2>
            <div className="pb-2 text-md text-gray-500">
              {}
              <p>
                {property.L_Address ? (
                  property.L_Address + ", "
                ) : (
                  <p>
                    <strong>Address:</strong> N/A
                  </p>
                )}
                {helper.formatLocation(
                  property.L_City,
                  property.L_State,
                  property.L_Zip,
                )}
              </p>
            </div>
            <p className="text-xl">
              <strong>{Math.floor(property.L_Keyword2) || "-"}</strong> beds
              {" | "}
              <strong>{Math.floor(property.LM_Dec_3) || "-"}</strong> baths
              {" | "}
              <strong>
                {helper.formatNumber(property.LM_Int2_3) || "-"}
              </strong>{" "}
              sqft
            </p>
          </div>
          <div className="w-full sm:w-[90%] md:w-[60%] m-auto my-1 px-5 pt-5 pb-5 rounded-lg bg-white border-2 border-gray-200">
            <h2 className="font-[700] text-2xl mt-1 mb-3">About</h2>
            <p>{property.L_Remarks || "Description unavailable."}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {details.map((detail, index) => (
                <p
                  className="inline bg-blue-100 p-2 rounded-md flex flex-col content-center"
                  key={index}
                >
                  <span className="block font-bold text-sm sm:text-base">
                    {detail.value}
                  </span>
                  <span className="block text-xs sm:text-sm">
                    {detail.desc}
                  </span>
                </p>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-[90%] md:w-[60%] m-auto my-5 px-5 py-5 rounded-lg bg-white border-2 border-gray-200">
            <h2 className="font-[700] text-2xl mt-1 mb-3">Openhouse Events</h2>
            {propertyOpenhouses?.openhouses?.length > 0 ? (
              propertyOpenhouses.openhouses.map((openhouse) => (
                <OpenHouseDetail
                  key={openhouse.L_ListingID}
                  openhouse={openhouse}
                />
              ))
            ) : (
              <p>No open houses scheduled.</p>
            )}
          </div>
          {property.LMD_MP_Latitude && property.LMD_MP_Longitude && (
            <PropertyMap
              lat={property.LMD_MP_Latitude}
              long={property.LMD_MP_Longitude}
            />
          )}
        </div>
      )}
    </div>
  );
}