import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner from "../../assets/banner.jpg";

import {
  useGetAllMoviesQuery,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/moviesApiSlice";

import MoviesCard from "./MoviesCard";

import {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} from "../../redux/features/movies/movieSlice";

import { useFetchGenreQuery } from "../../redux/api/genreApiSlice";

const AllMovies = () => {
  const { data } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenreQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const dispatch = useDispatch();

  const { moviesFilter, filteredMovies, uniqueYears } = useSelector(
    (state) => state.movies
  );

  // Movie years extract kar ke Redux me daal do
  useEffect(() => {
    const movieYear = data?.map((movie) => movie.year);
    const uniqueYrs = Array.from(new Set(movieYear));
    dispatch(setMovieYears(movieYear || []));
    dispatch(setUniqueYears(uniqueYrs || []));
  }, [data, dispatch]);

  // Centralized filtering logic
  useEffect(() => {
    if (!data) return;

    let filtered = data;

    if (moviesFilter.searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.name.toLowerCase().includes(moviesFilter.searchTerm.toLowerCase())
      );
    }

    if (moviesFilter.selectedGenre) {
      filtered = filtered.filter(
        (movie) => movie.genre === moviesFilter.selectedGenre
      );
    }

    if (moviesFilter.selectedYear) {
      filtered = filtered.filter(
        (movie) => String(movie.year) === moviesFilter.selectedYear
      );
    }

    switch (moviesFilter.selectedSort) {
      case "new":
        filtered = newMovies;
        break;
      case "top":
        filtered = topMovies;
        break;
      case "random":
        filtered = randomMovies;
        break;
      default:
        break;
    }

    dispatch(setFilteredMovies(filtered || []));
  }, [data, newMovies, topMovies, randomMovies, moviesFilter, dispatch]);

  // Handlers
  const handleSearchChange = (e) => {
    dispatch(setMoviesFilter({ searchTerm: e.target.value }));
  };

  const handleGenreChange = (genreId) => {
    dispatch(setMoviesFilter({ selectedGenre: genreId }));
  };

  const handleYearChange = (year) => {
    dispatch(setMoviesFilter({ selectedYear: year }));
  };

  const handleSortChange = (sortOption) => {
    dispatch(setMoviesFilter({ selectedSort: sortOption }));
  };

  return (
    <div className="-translate-y-[5rem]">
      <section>
        <div
          className="relative h-[50rem] w-screen mb-10 flex items-center justify-center bg-cover"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-60"></div>

          <div className="relative z-10 text-center text-white mt-[10rem] px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              The Movies Hub
            </h1>
            <p className="text-lg sm:text-2xl">
              Cinematic Odyssey: Unveiling the Magic of Movies
            </p>
          </div>

          <section className="absolute -bottom-[5rem] w-full px-4 flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center">
            <input
              type="text"
              className="h-[4rem] border px-6 outline-none rounded w-full sm:w-[30rem]"
              placeholder="Search Movie"
              value={moviesFilter.searchTerm}
              onChange={handleSearchChange}
            />

            <section className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <select
                className="border p-2 rounded w-full sm:w-auto"
                value={moviesFilter.selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
              >
                <option value="">Genres</option>
                {genres?.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <select
                className="border p-2 rounded w-full sm:w-auto"
                value={moviesFilter.selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                <option value="">Year</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                className="border p-2 rounded w-full sm:w-auto"
                value={moviesFilter.selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="new">New Movies</option>
                <option value="top">Top Movies</option>
                <option value="random">Random Movies</option>
              </select>
            </section>
          </section>
        </div>

        <section className="mt-[10rem] w-full px-4 flex justify-center items-center flex-wrap gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p className="text-white text-2xl text-center w-full">
              No movies found.
            </p>
          )}
        </section>
      </section>
    </div>
  );
};

export default AllMovies;
