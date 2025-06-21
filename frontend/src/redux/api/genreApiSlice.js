import { apiSlice } from "./apiSlice";
import { GENRE_URL } from "../constants";

const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (newGenre) => ({
        url: `${GENRE_URL}`,
        method: "POST",
        credentials: "include",
        body: newGenre,
      }),
    }),

    updateGenre: builder.mutation({
      query: ({ id, updateGenre }) => ({
        url: `${GENRE_URL}/${id}`,
        method: "PUT",
        credentials: "include",
        body: updateGenre,
      }),
    }),

    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    fetchGenre: builder.query({
      query: () => ({
        url: `${GENRE_URL}/genres`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useFetchGenreQuery,
  useUpdateGenreMutation,
} = genreApiSlice;
