export default function PropertyMap({ lat, long }) {
  const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <div className="w-200 m-auto rounded-lg border-2 border-gray-200">
      <iframe
        className="rounded-lg"
        width="100%"
        height={250}
        frameBorder={0}
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${long}&zoom=15`}
        allowFullScreen
      ></iframe>
    </div>
  );
}