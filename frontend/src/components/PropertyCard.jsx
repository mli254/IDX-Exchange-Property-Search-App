export default function PropertyCard({ property }) {
  return (
    <>
      <div className="box border-black border-2 shadow-md">
        Property Card
        <img src="https://media.istockphoto.com/vectors/avatar-photo-placeholder-icon-design-vector-id1221380217?k=20&m=1221380217&s=612x612&w=0&h=avdFJ5PNo-CSkbUZzQ0Xm8h3u5BovGfSNDrfRicPDfY=" />
        Price: {property.Price}
        Address: {property.Address}
        City: {property.City}
        State: {property.State}
        Beds: {property.Beds}
        Baths: {property.Baths}
        Sqft: {property.SQFT}
      </div>
    </>
  );
}
