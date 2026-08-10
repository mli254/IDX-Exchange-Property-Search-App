import { useState } from "react";
import placeholderImage from "../assets/placeholder.png";

function parseFirstPhoto(photosJSON) {
  if (!photosJSON) {
    return null;
  }
  try {
    const photos = JSON.parse(photosJSON);
    if (!Array.isArray(photos) || photos.length === 0) {
      return null;
    }
    return photos[0];
  } catch {
    console.log("JSON not able to parse the photo JSON string.");
    return null;
  }
}

function formatPrice(price, locale = "en-US", currency = "USD") {
  if (!price) {
    return null;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}

function formatSQFT(sqft) {
  if (!sqft) {
    return null;
  }

  return sqft.toLocaleString();
}

export default function PropertyCard({ property }) {
  const [photoURL, setPhotoURL] = useState(parseFirstPhoto(property.Photos));

  if (!photoURL) {
    setPhotoURL(placeholderImage);
  }

  const handlePhotoError = () => {
    setPhotoURL(placeholderImage);
  };

  return (
    <>
      <div className="box border-gray-200 border-1 rounded-lg shadow-lg shadow-gray-400 hover:shadow-lg hover:shadow-blue-900">
        <h1 className="p-2 font-bold text-lg">
          {property.Address || "Address: N/A"}
        </h1>
        <img src={photoURL} onError={handlePhotoError} loading="lazy" />
        <div className="flex flex-col p-2 m-2">
          <p>
            <strong>Price:</strong> {formatPrice(property.Price) || "—"}
          </p>
          <p>
            <strong>Address:</strong> {property.Address || "—"}
          </p>
          <p>
            <strong>Location:</strong>
            {property.City && property.State
              ? ` ${property.City}, ${property.State}`
              : " —"}
          </p>
          <p>
            <strong>Beds:</strong> {Math.floor(property.Beds) || "—"}
          </p>
          <p>
            <strong>Baths:</strong> {Math.floor(property.Baths) || "—"}
          </p>
          <p>
            <strong>Square Feet:</strong>{" "}
            {formatSQFT(property.SQFT) || "—"}
          </p>
        </div>
      </div>
    </>
  );
}
