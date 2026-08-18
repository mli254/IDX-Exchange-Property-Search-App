export default function PropertyMap({ lat, long }) {
  const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const embedURL = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${long}&zoom=15`;
  const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;

  return (
    <div className="w-full sm:w-[90%] md:w-[60%] m-auto my-2 px-5 py-5 rounded-lg bg-white border-2 border-gray-200">
      <h1 className="font-[700] text-2xl mt-1 mb-3">Around This Home</h1>
      <iframe
        className="rounded-lg m-auto"
        width="100%"
        height={250}
        frameBorder={0}
        referrerPolicy="strict-origin-when-cross-origin"
        src={embedURL}
        allowFullScreen
      ></iframe>
      <a
        className="block bg-blue-100 px-3 pt-3 pb-2 my-3 font-bold text-blue-500 underline rounded-md border-1 border-gray-300"
        href={directionsURL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* SVG obtained from: https://www.svgrepo.com/svg/374989/new-window */}
        Get Directions{" "}
        <svg
          className="inline mb-3 text-blue-500"
          fill="#427fff"
          xmlns="http://www.w3.org/2000/svg"
          width="16px"
          height="16px"
          viewBox="0 0 52 52"
          enable-background="new 0 0 52 52"
          xml:space="preserve"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <path d="M48.7,2H29.6C28.8,2,28,2.5,28,3.3v3C28,7.1,28.7,8,29.6,8h7.9c0.9,0,1.4,1,0.7,1.6l-17,17 c-0.6,0.6-0.6,1.5,0,2.1l2.1,2.1c0.6,0.6,1.5,0.6,2.1,0l17-17c0.6-0.6,1.6-0.2,1.6,0.7v7.9c0,0.8,0.8,1.7,1.6,1.7h2.9 c0.8,0,1.5-0.9,1.5-1.7v-19C50,2.5,49.5,2,48.7,2z"></path>{" "}
              <path d="M36.3,25.5L32.9,29c-0.6,0.6-0.9,1.3-0.9,2.1v11.4c0,0.8-0.7,1.5-1.5,1.5h-21C8.7,44,8,43.3,8,42.5v-21 C8,20.7,8.7,20,9.5,20H21c0.8,0,1.6-0.3,2.1-0.9l3.4-3.4c0.6-0.6,0.2-1.7-0.7-1.7H6c-2.2,0-4,1.8-4,4v28c0,2.2,1.8,4,4,4h28 c2.2,0,4-1.8,4-4V26.2C38,25.3,36.9,24.9,36.3,25.5z"></path>{" "}
            </g>{" "}
          </g>
        </svg>
      </a>
    </div>
  );
}