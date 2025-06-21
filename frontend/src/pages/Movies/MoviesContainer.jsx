import { useState } from "react";
import SliderComp from "../../components/SlideComp";
import Loader from "../../components/Loader";

import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/moviesApiSlice";

import { useFetchGenreQuery } from "../../redux/api/genreApiSlice";

const MoviesContainer = () => {
  const { data: genres, isLoading: genresLoading } = useFetchGenreQuery();
  const { data: randomMovies, isLoading: randomLoading } =
    useGetRandomMoviesQuery();
  const { data: topMovies, isLoading: topLoading } = useGetTopMoviesQuery();
  const { data, isLoading: newMoviesLoading } = useGetNewMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showGenres, setShowGenres] = useState(false);

  const handleGenreClick = (genreId) => {
    setSelectedGenre((prevGenre) => (prevGenre === genreId ? null : genreId));
  };

  const toggleGenres = () => {
    setShowGenres((prev) => !prev);
  };

  const filterMovies = data?.filter(
    (movie) => selectedGenre === null || movie.genre === selectedGenre
  );

  const isLoading =
    genresLoading || randomLoading || topLoading || newMoviesLoading;

  if (isLoading) return <Loader />;

  return (
    <div className="px-4 sm:px-6 md:px-8">
      {/* Mobile Genre Toggle */}
      <button
        className="lg:hidden w-full py-2 px-4 bg-gray-100 rounded-md mb-4 flex justify-between items-center"
        onClick={toggleGenres}
      >
        <span className="font-medium text-black ">
          {selectedGenre
            ? `Genre: ${genres.find((g) => g._id === selectedGenre)?.name}`
            : "All Genres"}
        </span>
        <span className="text-black">{showGenres ? "▲" : "▼"}</span>
      </button>

      <div className="flex flex-col lg:flex-row lg:justify-between items-start">
        {/* Genre Navigation */}
        <div
          className={`w-full lg:w-auto mb-6 lg:mb-0 ${
            showGenres ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2 px-2">Genres</h2>
          <nav className="flex flex-row flex-wrap lg:flex-col overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            {genres?.map((genre) => (
              <button
                key={genre._id}
                className={`transition duration-300 ease-in-out hover:bg-gray-200 block p-2 rounded mx-1 mb-1 lg:mx-0 lg:mb-[1rem] text-lg whitespace-nowrap ${
                  selectedGenre === genre._id ? "bg-gray-200 font-medium" : ""
                }`}
                onClick={() => {
                  handleGenreClick(genre._id);
                  if (window.innerWidth < 1024) setShowGenres(false);
                }}
              >
                {genre.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Movie Sections */}
        <section className="flex flex-col justify-center items-center w-full lg:pl-6">
          {randomMovies?.randomMovies &&
            randomMovies.randomMovies.length > 0 && (
              <div className="w-full mb-8">
                <h1 className="mb-3 text-xl font-semibold px-2">
                  Choose For You
                </h1>
                <div className="bg-gray-800 rounded-lg p-2 sm:p-4 overflow-hidden">
                  <SliderComp data={randomMovies.randomMovies} />
                </div>
              </div>
            )}

          {topMovies?.topRatedMovies && topMovies.topRatedMovies.length > 0 && (
            <div className="w-full mb-8">
              <h1 className="mb-3 text-xl font-semibold px-2">Top Movies</h1>
              <div className="bg-gray-800 rounded-lg p-2 sm:p-4 overflow-hidden">
                <SliderComp data={topMovies.topRatedMovies} />
              </div>
            </div>
          )}

          {filterMovies && filterMovies.length > 0 && (
            <div className="w-full mb-8">
              <h1 className="mb-3 text-xl font-semibold px-2">
                {selectedGenre
                  ? `${
                      genres.find((g) => g._id === selectedGenre)?.name
                    } Movies`
                  : "Choose Movie"}
              </h1>
              <div className="bg-gray-800 rounded-lg p-2 sm:p-4 overflow-hidden">
                <SliderComp data={filterMovies} />
              </div>
            </div>
          )}

          {(!filterMovies || filterMovies.length === 0) && (
            <div className="w-full p-4 text-center bg-gray-50 rounded-lg">
              <p>No movies found for the selected criteria</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MoviesContainer;
