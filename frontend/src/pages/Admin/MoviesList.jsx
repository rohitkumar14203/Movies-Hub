import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/moviesApiSlice";

const MoviesList = () => {
  const { data: movies } = useGetAllMoviesQuery();
  const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

  return (
    <div className="container mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-bold h-12">
            All Movies ({movies?.length})
          </div>

          <div className="flex flex-wrap justify-around items-center p-[2rem]">
            {movies?.map((movie) => (
              <div
                key={movie._id}
                className="max-w-sm m-[2rem] rounded overflow-hidden shadow-lg"
              >
                <img
                  src={`${BASE_IMAGE_URL}${movie.image.replace(/\\/g, "/")}`}
                  alt={movie.name}
                  className="w-full h-48 object-cover"
                />
                <div className="px-6 py-4 border border-gray-400">
                  <div className="font-bold text-xl mb-2">{movie.name}</div>
                  <p className="text-gray-700 text-base">{movie.detail}</p>
                </div>

                <div className="mt-[1rem] mb-[1rem] flex justify-center">
                  <Link
                    to={`/admin/movies/update/${movie._id}`}
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update Movie
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesList;
