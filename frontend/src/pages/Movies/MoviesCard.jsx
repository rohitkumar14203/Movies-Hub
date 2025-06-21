import { Link } from "react-router-dom";
import { useState } from "react";

const MoviesCard = ({ movie, loading }) => {
  const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
  const [imageError, setImageError] = useState(false);

  if (!movie || !movie._id) {
    return null; // Don't render if movie data is invalid
  }

  const finalImagePath = `${BASE_IMAGE_URL}${movie.image
    ?.replace(/\\/g, "/")
    .replace(/^\/+/, "")}`;
  console.log("Image Path:", finalImagePath);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative group mx-2 my-4 sm:m-[1rem] md:m-[1.5rem] lg:m-[2rem]">
      <Link to={`/movies/${movie._id}`}>
        {imageError ? (
          <div className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[20rem] lg:h-[20rem] rounded bg-gray-700 flex items-center justify-center text-white">
            {movie.name || "Movie"}
          </div>
        ) : (
          <img
            src={`${BASE_IMAGE_URL}${
              movie.image ? movie.image.replace(/\\/g, "/") : ""
            }`}
            alt={movie.name}
            onError={handleImageError}
            className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[20rem] lg:h-[20rem] rounded object-cover transition duration-300 ease-in-out transform group-hover:opacity-50"
          />
        )}
      </Link>

      <p className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 text-center truncate">
        {movie.name}
      </p>
    </div>
  );
};

export default MoviesCard;
