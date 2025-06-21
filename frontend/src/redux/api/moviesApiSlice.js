import { MOVIE_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const movieApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/all-movies`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: `${MOVIE_URL}/create-movie`,
        method: "POST",
        credentials: "include",
        body: newMovie,
      }),
    }),

    updateMovie: builder.mutation({
      query: ({ id, updateMovie }) => ({
        url: `${MOVIE_URL}/update-movie/${id}`,
        method: "PUT",
        credentials: "include",
        body: updateMovie,
      }),
    }),

    addMovieReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: "POST",
        credentials: "include",
        body: { rating, id, comment },
      }),
    }),

    deleteComment: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/delete-comment`,
        method: "DELETE",
        credentials: "include",
        body: { movieId, reviewId },
      }),
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/delete-movie/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getSpecificMovie: builder.query({
      query: (id) => ({
        url: `${MOVIE_URL}/specific-movie/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getNewMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/new-movies`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getTopMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/top-movies`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getRandomMovies: builder.query({
      query: () => ({
        url: `${MOVIE_URL}/random-movies`,
        method: "GET",
        credentials: "include",
      }),
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        credentials: "include",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useAddMovieReviewMutation,
  useDeleteCommentMutation,
  useDeleteMovieMutation,
  useGetSpecificMovieQuery,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
  useUploadImageMutation,
} = movieApiSlice;
