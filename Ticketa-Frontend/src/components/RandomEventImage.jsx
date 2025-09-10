import { useEffect, useState } from "react";

const fallbackImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836", // concert crowd
  "https://images.unsplash.com/photo-1531058020387-3be344556be6", // conference stage
  "https://images.unsplash.com/photo-1549921296-3a18cae6c36b", // festival lights
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // people cheering
];

const RandomEventImage = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 4);
    const localImage = `/event-image-${randomIndex + 1}.webp`;

    // try local first, fallback if not found
    const testImage = new Image();
    testImage.src = localImage;
    testImage.onload = () => setImageSrc(localImage);
    testImage.onerror = () => setImageSrc(fallbackImages[randomIndex]);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden rounded-xl bg-gray-800">
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Random Event"
          onLoad={() => setLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 
            ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"} 
            hover:scale-110`}
        />
      )}
    </div>
  );
};

export default RandomEventImage;
