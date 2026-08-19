import { useState } from "react";
import placeholderImage from "../assets/placeholder.png";

export default function PropertyImageCarousel({ imageArray }) {
  const counter = imageArray.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = counter > 0 ? imageArray : [placeholderImage];

  function handleNext(event) {
    event.preventDefault();
    event.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === counter ? 0 : prevIndex + 1,
    );
  }

  function handlePrev(event) {
    event.preventDefault();
    event.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? counter - 1 : prevIndex - 1,
    );
  }

  function handlePhotoError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = placeholderImage;
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
        {currentIndex + 1} / {counter > 0 ? counter : counter + 1} photos
      </div>
      <button
        className="absolute top-[50%] left-0 -translate-y-[75%] m-1 p-1 text-white text-2xl font-bold bg-black/70 rounded-full cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
        onClick={(e) => {
          handlePrev(e);
        }}
        disabled={counter < 2}
      >
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
    // Arrow SVGs from: https://www.svgrepo.com/svg/520523/arrow-left-5
  );
}