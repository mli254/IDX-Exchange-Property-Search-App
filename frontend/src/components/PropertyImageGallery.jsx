import { useEffect, useState } from "react";
// import placeholderImage from "../assets/placeholder.png";
import Lightbox from "./Lightbox";

export default function PropertyImageGallery({ imageArray }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const photos = imageArray.length > 0 ? imageArray : ["/placeholder.png"];

  function handlePhotoError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/placeholder.png";
  }

  function handleThumbnailClick(event, index) {
    setCurrentIndex(index);
    event.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
      container: "nearest"
    });
  }

  function handleEsc(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      setLightboxVisible(false);
    }
  }

  function hideLightBox(event) {
    event.preventDefault();
    setLightboxVisible(false);
  }

  function showLightbox(event) {
    event.preventDefault();
    setLightboxVisible(true);
  }

  useEffect(() => {
    if (lightboxVisible) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [lightboxVisible]);

  return (
    <div>
      {lightboxVisible && (
        <div
          className="z-1 fixed inset-0 h-dvh w-full bg-black/50"
          tabIndex={0}
          onKeyDown={handleEsc}
          onClick={hideLightBox}
        >
          <Lightbox imageArray={photos} startingIndex={currentIndex} />
        </div>
      )}
      <div className="w-full">
        <div className="flex items-center bg-gray-300 mt-2 h-100 rounded-lg">
          <img
            className="max-h-full m-auto cursor-pointer"
            key={currentIndex}
            src={photos[currentIndex]}
            onError={handlePhotoError}
            onClick={showLightbox}
            loading="lazy"
          />
        </div>
        <div className="overflow-x-auto pt-2 pb-4">
          <div className="flex justify-center gap-1 w-max min-w-full">
            {photos.map((image, index) => (
              <img
                className={`box-border rounded-lg w-18 h-12 object-cover shrink-0 ${currentIndex === index ? "border-2 border-black" : ""}`}
                key={index}
                src={image}
                onClick={(event) => handleThumbnailClick(event, index)}
                onError={handlePhotoError}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}