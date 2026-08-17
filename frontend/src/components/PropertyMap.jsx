export default function PropertyMap({ lat, long }) {
  const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <div className="w-full sm:w-[90%] md:w-[60%] m-auto my-2 px-5 py-5 rounded-lg bg-white border-2 border-gray-200">
      <h1 className="font-[700] text-2xl mt-1 mb-3">Around This Home</h1>
      <iframe
        className="rounded-lg m-auto"
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