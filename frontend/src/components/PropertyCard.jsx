import { Link } from "react-router-dom";
import * as helper from "../utils/helper";
import PropertyImageCarousel from "./PropertyImageCarousel";

export default function PropertyCard({ property }) {
  const photoArray = helper.parsePhotos(property.Photos);

  return (
    <Link to={`/property/${property.ListingID}`}>
      <div className="rounded-lg shadow-sm shadow-gray-400 bg-white hover:shadow-lg hover:shadow-blue-900">
        <PropertyImageCarousel imageArray={photoArray} />
        <div className="flex flex-col p-2 m-2">
          <h2 className="pb-2 font-bold text-2xl">
          {/* 
            Since multiple fields have a chance to be null, a fallback string is provided using 
            the "or" operator (||) or a dedicated parsing function
          */}
            {helper.formatPrice(property.Price) || "Price: N/A"}
          </h2>
          <p>
            <strong>{Math.floor(property.Beds) || "-"}</strong> beds{" | "}
            <strong>{Math.floor(property.Baths) || "-"}</strong> baths{" | "}
            <strong>{helper.formatNumber(property.SQFT) || "-"}</strong>{" "}
            {property.LivingAreaUnits === "SquareMeters"
              ? "sq. meters"
              : "sqft"}
          </p>
          <div className="my-2 text-[0.9rem] text-gray-600">
            <p>{property.Address || "—"}</p>
            <p>
              {helper.formatLocation(
                property.City,
                property.State,
                property.Zipcode,
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}