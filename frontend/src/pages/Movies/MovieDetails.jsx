import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/moviesApiSlice";

import MovieTab from "./MovieTab";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

  const {
    data: movie,
    refetch,
    isLoading,
    error,
  } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  if (isLoading)
    return <div className="text-white text-center mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center mt-8">Failed to load movie.</div>
    );
  if (!movie) return null;

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-32">
        <Link
          to="/"
          className="text-white font-semibold hover:underline inline-block my-6"
        >
          ⬅️ Go Back
        </Link>

        {/* Image */}
        <div className="flex justify-center items-center mb-8">
          <img
            src={`${BASE_IMAGE_URL}${movie.image.replace(/\\/g, "/")}`}
            alt={movie?.name}
            className="w-full max-w-[500px] rounded object-contain"
          />
        </div>

        {/* Movie Details */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <section className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {movie.name}
            </h2>
            <p className="text-[#B0B0B0] text-base md:text-lg leading-relaxed">
              {movie.detail}
            </p>
          </section>

          <div className="flex-1">
            <p className="text-2xl text-white font-semibold mb-4">
              Releasing Date: {movie.year}
            </p>

            <div>
              <h3 className="text-xl text-white font-semibold mb-2">Cast:</h3>
              {movie.cast.map((c, index) => (
                <ul key={index} className="text-[#B0B0B0]">
                  <li className="mb-1">{c}</li>
                </ul>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}

        <div>
          <MovieTab
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
