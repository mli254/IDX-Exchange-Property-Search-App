import { useState } from "react";
import { Link } from "react-router-dom";
import placeholderImage from "../assets/placeholder.png";
import * as helper from "../utils/helper"

export default function PropertyCard({ property }) {
  const [photoURL, setPhotoURL] = useState(helper.parseFirstPhoto(property.Photos));

  if (!photoURL) {
    setPhotoURL(placeholderImage);
  }

  const handlePhotoError = () => {
    setPhotoURL(placeholderImage);
  };

  return (
    <Link to={`/property/${property.ListingID}`}>
      <div className="box rounded-lg shadow-lg shadow-gray-400 hover:shadow-lg hover:shadow-blue-900">
        <img
          className="rounded-t-lg min-w-[100%] h-48 object-cover"
          src={photoURL}
          onError={handlePhotoError}
          loading="lazy"
        />
        <div className="flex flex-col p-2 m-2">
          <h2 className="pb-2 font-[700] text-2xl">
            {helper.formatPrice(property.Price) || "—"}
          </h2>
          <p>
            <strong>{Math.floor(property.Beds) || "-"}</strong> beds{" | "}
            <strong>{Math.floor(property.Baths) || "-"}</strong> baths{" | "}
            <strong>{helper.formatSQFT(property.SQFT) || "-"}</strong> sqft
          </p>
          <div className="my-2 text-[0.9rem] text-gray-600">
            <p>{property.Address || "—"}</p>
            <p>
              {helper.formatLocation(property.City, property.State, property.Zipcode)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
