import { useState } from "react";
import placeholderImage from "../assets/placeholder.png";

export default function PropertyImageGallery({ imageArray }) {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <div className="w-full">
            <div className="bg-black mt-1 h-100">
                <img
                    className="max-h-full m-auto"
                    key={currentIndex}
                    src={imageArray[currentIndex]}
                    onError={() => handlePhotoError(this)}
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
    )
}