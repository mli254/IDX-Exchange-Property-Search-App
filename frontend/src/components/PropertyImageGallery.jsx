import { useEffect, useState } from "react";
import placeholderImage from "../assets/placeholder.png";
import Lightbox from "./Lightbox";

export default function PropertyImageGallery({ imageArray }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxVisible, setLightboxVisible] = useState(false);

    if (imageArray.length===0) {
        imageArray.push(placeholderImage);
    }

    function handlePhotoError(image) {
        image.onError = "";
        image.src = placeholderImage;
        return true;
    }

    function handleThumbnailClick(index) {
        setCurrentIndex(index);
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
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        }
    }, [lightboxVisible]);

    return (
        <div>
            {lightboxVisible && (<div className="z-1 fixed top-0 left-0 w-full h-full bg-black/50" tabIndex={0} onKeyDown={handleEsc} onClick={hideLightBox}>
                <Lightbox imageArray={imageArray} startingIndex={currentIndex}/>
            </div>)}
            <div className="w-full">
                <div className="flex items-center bg-black mt-1 h-100">
                    <img
                        className="max-h-full m-auto cursor-pointer"
                        key={currentIndex}
                        src={imageArray[currentIndex]}
                        onError={() => handlePhotoError(this)}
                        onClick={showLightbox}
                        loading="lazy"
                    />
                </div>
                <div className="overflow-x-auto pt-2 pb-4">
                    <div className="flex justify-center gap-1 w-max min-w-full">
                        {imageArray.map((image, index) => (
                            <img
                                className={`box-border rounded-lg w-18 h-12 object-cover shrink-0 ${currentIndex === index ? "border-2 border-black" : ""}`}
                                key={index}
                                src={image}
                                onClick={() => handleThumbnailClick(index)}
                                onError={() => handlePhotoError(this)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}