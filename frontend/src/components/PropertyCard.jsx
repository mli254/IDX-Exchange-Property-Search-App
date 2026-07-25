function parsePhotos(photosJSON) {
    try {
        const photos = JSON.parse(photosJSON);

        return photos[0];
    } catch {
        console.log("something went wrong.");
        return null;
    }
}

export default function PropertyCard({ property }) {
    const photoURL = parsePhotos(property.Photos);
    // "https://media.istockphoto.com/vectors/avatar-photo-placeholder-icon-design-vector-id1221380217?k=20&m=1221380217&s=612x612&w=0&h=avdFJ5PNo-CSkbUZzQ0Xm8h3u5BovGfSNDrfRicPDfY="
  return (
    <>
      <div className="box border-black border-2 shadow-md">
        <h1 className="p-2">Property Card</h1>
        <img src={photoURL} />
        <div className="flex flex-col p-2 m-2">
            <p><strong>Price:</strong> {property.Price}</p>
            <p><strong>Address:</strong> {property.Address}</p>
            <p><strong>City:</strong> {property.City}</p>
            <p><strong>State:</strong> {property.State}</p>
            <p><strong>Beds:</strong> {property.Beds}</p>
            <p><strong>Baths:</strong> {property.Baths}</p>
            <p><strong>Sqft:</strong> {property.SQFT}</p>
        </div>
      </div>
    </>
  );
}
