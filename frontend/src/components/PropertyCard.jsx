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
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}

export default function PropertyCard({ property }) {
  const photoURL = parseFirstPhoto(property.Photos);
  return (
    <>
      <div className="box border-blue-900 border-1 shadow-lg shadow-gray-400 hover:shadow-lg hover:shadow-blue-900">
        <h1 className="p-2 font-bold text-lg">
          {property.Address || "Address: N/A"}
        </h1>
        {photoURL ? (
          <img src={photoURL} loading="lazy" />
        ) : (
          <div className="bg-gray-300 min-h-[12rem] text-center pt-3">
            No photo available.
          </div>
        )}

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
            <strong>Square Feet:</strong> {property.SQFT.toLocaleString() || "—"}
          </p>
        </div>
      </div>
    </>
  );
}
