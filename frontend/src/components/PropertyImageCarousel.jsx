import { useState } from "react";

export default function PropertyImageCarousel({ imageArray }) {
  const counter = imageArray.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  // checks if the helper parsing function returned an empty array, and sets the photo array to the placeholder/error image if so
  const photos = counter > 0 ? imageArray : ["/placeholder.png"];

  function handleNext(event) {
    event.preventDefault();
    event.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === counter ? 0 : prevIndex + 1,  // wraps the index around once it reaches the end of the photo array
    );
  }

  function handlePrev(event) {
    event.preventDefault();
    event.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? counter - 1 : prevIndex - 1,  // wraps the index around once it reaches the beginning of the photo array
    );
  }

  // swaps an image to the placeholder/error image if the original source link results in an error, e.g. a 404 HTTP error
  function handlePhotoError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/placeholder.png";
  }

  return (
    <div className="relative">
      <img
        className="rounded-t-lg min-w-full h-48 object-cover"
        key={currentIndex}
        src={photos[currentIndex]}
        onError={handlePhotoError}
        loading="lazy"
      />
      <div className="absolute bottom-0 right-0 m-1 px-1 pb-1 bg-black/50 rounded-lg text-white font-bold">
        {/* 
          converts index from a 0-based to a 1-based index for readability; 
          also checks if counter is empty (an error occurred when parsing/fetching photos) and adds 1 so counter displays as
          1/1 instead of 1/0
        */}
        {currentIndex + 1} / {counter > 0 ? counter : counter + 1} photos
      </div>
      <button
        className="absolute top-[50%] left-0 -translate-y-[75%] m-1 p-1 text-white text-2xl font-bold bg-black/70 rounded-full cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
        onClick={(e) => {
          handlePrev(e);
        }}
        disabled={counter < 2}
      >
        {/* Arrow SVGs from: https://www.svgrepo.com/svg/520523/arrow-left-5*/}
        <svg
          className="-translate-x-[0.75px]"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M15 7L10 12L15 17"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <button
        className="absolute top-[50%] right-0 -translate-y-[75%] m-1 p-1 text-white text-2xl font-bold bg-black/70 rounded-full cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
        onClick={handleNext}
        disabled={counter < 2}
      >
        {/* Arrow SVGs from: https://www.svgrepo.com/svg/520523/arrow-left-5*/}
        <svg
          className="translate-x-[0.75px]"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="matrix(-1, 0, 0, 1, 0, 0)"
          stroke="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M15 7L10 12L15 17"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
    </div>
  );
}