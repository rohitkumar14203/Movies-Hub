import Header from "./Movies/Header";
import MoviesContainer from "./Movies/MoviesContainer";

const Home = () => {
  return (
    <>
      <Header />
      <div className="mt-4 sm:mt-8 lg:mt-10 px-4 sm:px-6 md:px-8">
        <MoviesContainer />
      </div>
    </>
  );
};

export default Home;
