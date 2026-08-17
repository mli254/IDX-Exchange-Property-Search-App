import { useState } from "react";
import placeholderImage from "../assets/placeholder.png";

export default function Lightbox({ imageArray, startingIndex }) {
  const counter = imageArray.length;
  const [currentIndex, setCurrentIndex] = useState(startingIndex);

  if (counter === 0) {
    imageArray.push(placeholderImage);
  }

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

  function handlePhotoError(image) {
    image.onError = "";
    image.src = placeholderImage;
    return true;
  }

  return (
    <div className="flex items-center justify-between w-full h-full">
      <button
        className="m-1 mx-5 p-1 pt-0 text-white text-2xl font-bold bg-black/70 rounded-xl border-1 border-white cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
        onClick={(e) => {
          handlePrev(e);
        }}
        disabled={counter < 2}
      >
        &larr;
      </button>
      <div className="relative">
        <img
          className="max-h-full m-auto"
          key={currentIndex}
          src={imageArray[currentIndex]}
          onError={() => handlePhotoError(this)}
          onClick={(event) => event.stopPropagation()}
          loading="lazy"
        />
        <div className="absolute top-0 right-0 m-2 px-1 pb-1 bg-black/50 rounded-lg text-white font-bold">
          {currentIndex + 1} / {counter} photos
        </div>
      </div>

      <button
        className="m-1 mx-5 p-1 pt-0 text-white text-2xl font-bold bg-black/70 rounded-xl border-1 border-white cursor-pointer disabled:bg-gray-200/75 disabled:cursor-not-allowed"
        onClick={handleNext}
        disabled={counter < 2}
      >
        &rarr;
      </button>
    </div>
  );
}
