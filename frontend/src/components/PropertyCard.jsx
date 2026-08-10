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

function formatLocation(city, state, zip) {
  if (city && state && zip) {
    return `${city}, ${state} ${zip}`;
  }

  if (!city && state && zip) {
    return `${state} ${zip}`;
  }

  if (!state && city && zip) {
    return `${city}, ${zip}`;
  }

  if (!city && !state && parseInt(zip) > 0) {
    return `${zip}`;
  }

  if (!city && !state && parseInt(zip) < 1) {
    return "—";
  }
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
      <div className="box rounded-lg shadow-lg shadow-gray-400 hover:shadow-lg hover:shadow-blue-900">
        <img
          className="rounded-t-lg min-w-[100%] h-48 object-cover"
          src={photoURL}
          onError={handlePhotoError}
          loading="lazy"
        />
        <div className="flex flex-col p-2 m-2">
          <h2 className="pb-2 font-[700] text-2xl">
            {formatPrice(property.Price) || "—"}
          </h2>
          <p>
            <strong>{Math.floor(property.Beds) || "-"}</strong> beds{" | "}
            <strong>{Math.floor(property.Baths) || "-"}</strong> baths{" | "}
            <strong>{formatSQFT(property.SQFT) || "-"}</strong> sqft
          </p>
          <div className="my-2 text-[0.9rem] text-gray-600">
            <p>{property.Address || "—"}</p>
            <p>
              {formatLocation(property.City, property.State, property.Zipcode)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
