import { useState } from "react";

export default function Lightbox({ imageArray, startingIndex }) {
  const counter = imageArray.length;
  const [currentIndex, setCurrentIndex] = useState(startingIndex);

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
    <div>
      <button
        className="z-2 absolute left-4 top-[50%] -translate-y-[50%] m-1 mx-5 p-1 text-white text-2xl font-bold bg-black/70 rounded-full border-1 border-white cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
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
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          className="max-h-[90dvh] max-w-[90vw] object-contain"
          key={currentIndex}
          src={photos[currentIndex]}
          onError={handlePhotoError}
          onClick={(event) => event.stopPropagation()}
          loading="lazy"
        />
        <div className="absolute top-0 right-0 m-3 px-1 pb-1 bg-black/50 rounded-lg text-white font-bold">
          {/* 
            converts index from a 0-based to a 1-based index for readability; 
            also checks if counter is empty (an error occurred when parsing/fetching photos) and adds 1 so counter displays as
            1/1 instead of 1/0
          */} 
          {currentIndex + 1} / {counter > 0 ? counter : counter + 1} photos
        </div>
      </div>

      <button
        className="z-2 m-1 mx-5 p-1 text-white text-2xl font-bold bg-black/70 rounded-full border-1 border-white cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed absolute right-4 top-[50%] -translate-y-[50%]"
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