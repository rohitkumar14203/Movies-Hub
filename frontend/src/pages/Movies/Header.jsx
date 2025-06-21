import { useGetNewMoviesQuery } from "../../redux/api/moviesApiSlice";
import { Link } from "react-router-dom";
import SliderComp from "../../components/SlideComp";
import Loader from "../../components/Loader";

const Header = () => {
  const { data, isLoading, error } = useGetNewMoviesQuery();

  if (isLoading) return <Loader />;
  if (error)
    return <div className="text-center p-4">Failed to load movies</div>;
  if (!data || data.length === 0)
    return <div className="text-center p-4">No movies available</div>;

  return (
    <div className="flex flex-col px-4 sm:px-6 mt-[1rem] sm:mt-[1.5rem] md:mt-[2rem] md:flex-row justify-between items-center md:items-start">
      <nav className="w-full md:w-[10rem] mb-4 md:mb-0 flex flex-row md:flex-col justify-center md:justify-start">
        <Link
          to="/"
          className="transition duration-300 ease-in-out hover:bg-teal-200 block p-2 rounded mr-2 md:mr-0 md:mb-2 text-lg"
        >
          Home
        </Link>

        <Link
          to="/movies"
          className="transition duration-300 ease-in-out hover:bg-teal-200 block p-2 rounded text-lg"
        >
          Browse Movies
        </Link>
      </nav>

      <div className="w-full md:w-[80%]">
        <SliderComp data={data} />
      </div>
    </div>
  );
};

export default Header;
