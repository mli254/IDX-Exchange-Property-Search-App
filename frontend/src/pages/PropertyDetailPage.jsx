import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/client";
import LoadingCard from "../components/LoadingCard";
import ErrorCard from "../components/ErrorCard";
import OpenHouseDetail from "../components/OpenHouseDetail";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyDetails from "../components/PropertyDetails";
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
  const details = [];           // corresponds to the blue fields at the top of the page
  const interiorFeatures = [];  // corresponds to the "interior tab" in property details
  const exteriorFeatures = [];  // corresponds to the "exterior tab" in property details

  if (property) {
    /*
      checks for "property type" (e.g. Single Family Residence, Townhouse); 
      if it doesn't exist, checks for the "property class", which is usually "Residential"
    */
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

    /*
      checks for a numerical value from the "StoriesTotal" field; otherwise checks for a string representation from
      the levels field represented by "L_Keyword7"
    */
    if (property.StoriesTotal) {
      details.push({
        desc: "Levels",
        value: property.StoriesTotal,
      });
    } else if (property.L_Keyword7) {
      details.push({
        desc: "Levels",
        value: helper.parseCommaAndCamelCase(property.L_Keyword7).join(", "),
      });
    }

    // checks for the year built
    if (property.YearBuilt) {
      details.push({
        desc: "Year Built",
        value: property.YearBuilt,
      });
    }

    // checks for lot size as represented by "L_Keyword1"
    if (property.L_Keyword1) {
      const lotSize = helper.formatNumber(parseInt(property.L_Keyword1));
      if (lotSize) {
        if (property.LotSizeUnits && property.LotSizeUnits === "Acres") {
          details.push({
            desc: "Lot Size",
            value: `${lotSize} acres`,
          });
        } else {
          details.push({
            desc: "Lot Size",
            value: `${lotSize} sqft`,
          });
        }
      }
    }

    // checks for the number of garage parking spaces, represented by "L_Keyword5"
    if (property.L_Keyword5) {
      details.push({
        desc: "Parking",
        value: `${property.L_Keyword5} Car Garage`,
      });
    }

    // checks if the property is part of a senior community
    if (property.SeniorCommunityYN) {
      details.push({
        desc: "Community Type",
        value: "Senior Community",
      });
    }

    // checks if the property is newly constructed and previously unoccupied
    if (property.NewConstructionYN) {
      details.push({
        desc: "Status",
        value: "Newly Constructed",
      });
    }

    /*
      checks both if heating exists and the type of heating provided;
      - sometimes HeatingYN = 1 but Heating is null, so there's a fallback "Included" description
      - otherwise, Heating may be a single ite, (e.g. "Central") or have multiple items separated by commas (e.g. "Central,Forced")
    */
    if (property.HeatingYN && property.HeatingYN > 0) {
      const heatingType = helper.parseCommaAndCamelCase(property.Heating);
      interiorFeatures.push({
        desc: "Heating",
        value: heatingType || "Included",
      });
    }

    // checks for cooling details using similar logic to heating
    if (property.CoolingYN && property.CoolingYN > 0) {
      const coolingType = helper.parseCommaAndCamelCase(property.Cooling);
      interiorFeatures.push({
        desc: "Cooling",
        value: coolingType || "Included",
      });
    }

    // checks for interior features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.InteriorFeatures) {
      interiorFeatures.push({
        desc: "Interior Features",
        value: helper.parseCommaAndCamelCase(property.InteriorFeatures),
      });
    }

    // checks for appliances; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.Appliances) {
      interiorFeatures.push({
        desc: "Appliances",
        value: helper.parseCommaAndCamelCase(property.Appliances),
      });
    }

    // checks if a fireplace exists, and if any details are provided; similar logic to cooling and heating
    if (property.FireplaceYN && property.FireplaceYN > 0) {
      const fireplaceFeatures = helper.parseCommaAndCamelCase(
        property.FireplaceFeatures,
      );
      if (fireplaceFeatures && fireplaceFeatures[0] !== "None") {
        interiorFeatures.push({
          desc: "Fireplace",
          value: fireplaceFeatures,
        });
      } else {
        interiorFeatures.push({
          desc: "Fireplace",
          value: "Included",
        });
      }
    }

    // checks if a property has a spa; similar logic to checking for fireplaces
    if (property.SpaYN && property.SpaYN > 0) {
      const spaFeatures = helper.parseCommaAndCamelCase(property.SpaFeatures);
      if (spaFeatures && spaFeatures[0] !== "None") {
        interiorFeatures.push({
          desc: "Spa",
          value: spaFeatures,
        });
      } else {
        interiorFeatures.push({
          desc: "Spa",
          value: "Included",
        });
      }
    }

    // checks for room types; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.RoomType) {
      interiorFeatures.push({
        desc: "Types of Rooms Available",
        value: helper.parseCommaAndCamelCase(property.RoomType),
      });
    }

    // checks for flooring details; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.Flooring) {
      interiorFeatures.push({
        desc: "Flooring Type",
        value: helper.parseCommaAndCamelCase(property.Flooring),
      });
    }
    
    // checks for architectural style; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.ArchitecturalStyle) {
      exteriorFeatures.push({
        desc: "Architectural Style",
        value: helper.parseCommaAndCamelCase(property.ArchitecturalStyle),
      });
    }

    // checks for patio/porch features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.PatioAndPorchFeatures) {
      exteriorFeatures.push({
        desc: "Patio and Porch",
        value: helper.parseCommaAndCamelCase(property.PatioAndPorchFeatures),
      });
    }

    // checks for info on water sources; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.WaterSource) {
      exteriorFeatures.push({
        desc: "Water Source",
        value: helper.parseCommaAndCamelCase(property.WaterSource),
      });
    }

    /* 
      checks if a pool exists, and if any details are provided;
      for some properties, a pool may not be private, but pool details are still provided; the code handles the cases where:
      1. private pool is marked true, pool features are provided, and string does not contain "None"
        -> Pool Features are visible on page and "private" is added to the description if not already within the PoolFeatures field
      2. private pool is marked false, but pool features are provided and string does not contain "None"
        -> Pool Features are given the pool features from the SQL data directly
      3. private pool is marked true, but pool features is null
        -> Pool Features is listed with the only description being "Private"
    */
    if (property.PoolPrivateYN || property.PoolFeatures) {
      if (property.PoolFeatures) {
        const poolFeatures = helper.parseCommaAndCamelCase(
          property.PoolFeatures,
        );
        if (poolFeatures[0] !== "None") {
          if (property.PoolPrivateYN > 0 && !poolFeatures.includes("Private")) {
            poolFeatures.push("Private");
          }
          exteriorFeatures.push({
            desc: "Pool Features",
            value: poolFeatures,
          });
        }
      } else if (property.PoolPrivateYN > 0) {
        exteriorFeatures.push({
          desc: "Pool Features",
          value: "Private",
        });
      }
    }

    // checks if a view exists, and populates with any details provided; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.ViewYN && property.View && property.ViewYN > 0) {
      exteriorFeatures.push({
        desc: "View",
        value: helper.parseCommaAndCamelCase(property.View),
      });
    }

    // checks for community features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.CommunityFeatures) {
      exteriorFeatures.push({
        desc: "Communities",
        value: helper.parseCommaAndCamelCase(property.CommunityFeatures),
      });
    }

    // checks for security features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.SecurityFeatures) {
      exteriorFeatures.push({
        desc: "Security Features",
        value: helper.parseCommaAndCamelCase(property.SecurityFeatures),
      });
    }

    // checks for lot (i.e. backyard) features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.LotFeatures) {
      exteriorFeatures.push({
        desc: "Lot Features",
        value: helper.parseCommaAndCamelCase(property.LotFeatures),
      });
    }

    // checks for roof features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.Roof) {
      exteriorFeatures.push({
        desc: "Roofing",
        value: helper.parseCommaAndCamelCase(property.Roof),
      });
    }

    // checks for fencing features; fields are typically stored in the format "CamelCase,CamelCase,..."
    if (property.Fencing) {
      exteriorFeatures.push({
        desc: "Fencing",
        value: helper.parseCommaAndCamelCase(property.Fencing),
      });
    }

    // checks if a garage is attached to the property 
    if (property.AttachedGarageYN && property.AttachedGarageYN > 0) {
      exteriorFeatures.push({
        desc: "Garage",
        value: "Attached",
      });
    }

    // checks if a property is attached to another property unaffiliated with the property's lease
    if (property.PropertyAttachedYN && property.PropertyAttachedYN > 0) {
      exteriorFeatures.push({
        desc: "Property",
        value: "Attached to Another Structure",
      });
    }
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
              {helper.formatPrice(property.L_SystemPrice) || "Price: N/A"}
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
              {property.LivingAreaUnits === "SquareMeters"
                ? "sq. meters"
                : "sqft"}
            </p>
          </div>
          <div className="w-full sm:w-[90%] md:w-[60%] m-auto my-1 px-5 pt-5 pb-5 rounded-lg bg-white border-2 border-gray-200">
            <h2 className="font-bold text-2xl mt-1 mb-3">About</h2>
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
          <div className="w-full sm:w-[90%] md:w-[60%] m-auto mt-5 mb-1 px-5 py-5 rounded-lg bg-white border-2 border-gray-200">
            <h2 className="font-[700] text-2xl mt-1 mb-3">Property Details</h2>
            <PropertyDetails
              interiorFeatures={interiorFeatures}
              exteriorFeatures={exteriorFeatures}
            />
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