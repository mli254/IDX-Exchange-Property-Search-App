import { useState } from "react";
import placeholderImage from "../assets/placeholder.png";

export default function Lightbox({ imageArray, startingIndex }) {
  const counter = imageArray.length;
  const [currentIndex, setCurrentIndex] = useState(startingIndex);

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
    <div>
      <button
        className="z-2 absolute left-4 top-[50%] -translate-y-[50%] m-1 mx-5 p-1 text-white text-2xl font-bold bg-black/70 rounded-full border-1 border-white cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
        onClick={(e) => {
          handlePrev(e);
        }}
        disabled={counter < 2}
      >
        <svg className="-translate-x-[0.75px]" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7L10 12L15 17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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
          {currentIndex + 1} / {counter > 0 ? counter : counter + 1} photos
        </div>
      </div>

      <button
        className="z-2 m-1 mx-5 p-1 text-white text-2xl font-bold bg-black/70 rounded-full border-1 border-white cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed absolute right-4 top-[50%] -translate-y-[50%]"
        onClick={handleNext}
        disabled={counter < 2}
      >
        <svg className="translate-x-[0.75px]" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7L10 12L15 17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
    </div>
    // Arrow SVGs from: https://www.svgrepo.com/svg/520523/arrow-left-5
  );
}