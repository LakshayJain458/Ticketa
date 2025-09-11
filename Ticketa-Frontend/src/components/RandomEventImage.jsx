import { useEffect, useState } from "react";

const fallbackImages = [
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D", // concert crowd
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D", // conference stage
  "https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvbmNlcnR8ZW58MHx8MHx8fDA%3D", // festival lights
  "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNvbmNlcnR8ZW58MHx8MHx8fDA%3D", // people cheering
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
