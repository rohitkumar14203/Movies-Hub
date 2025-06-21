import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
  useDeleteMovieMutation,
} from "../../redux/api/moviesApiSlice";
import { toast } from "react-toastify";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    ratings: 0,
    image: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const { data: initialMovieData } = useGetSpecificMovieQuery(id);

  const [updateMovie, { isLoading: isUpdatingMovie }] =
    useUpdateMovieMutation();
  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  useEffect(() => {
    if (initialMovieData) {
      setMovieData(initialMovieData);
    }
  }, [initialMovieData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpdateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        !movieData.cast
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      let uploadedImagePath = movieData.image;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;
        } else {
          console.error("Failed to upload image:", uploadImageErrorDetails);
          toast.error("Failed to upload image");
          return;
        }
      }

      await updateMovie({
        id: id,
        updateMovie: { ...movieData, image: uploadedImagePath },
      });

      toast.success("Movie updated successfully");
      navigate("/movies");
    } catch (error) {
      console.error("Failed to update movie:", error);
      toast.error("Failed to update movie");
    }
  };

  const handleDeleteMovie = async () => {
    try {
      await deleteMovie(id);
      toast.success("Movie deleted successfully");
      navigate("/movies");
    } catch (error) {
      console.error("Failed to delete movie:", error);
      toast.error(`Failed to delete movie: ${error?.message}`);
    }
  };

  return (
    <div className="container flex justify-center items-center mt-4 px-2 sm:px-4">
      <form className="w-full max-w-[50rem] bg-transparent">
        <p className="text-green-200 text-2xl mb-4">Update Movie</p>

        <div className="mb-4">
          <label className="block text-white">
            Name:
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded bg-transparent text-white"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-white">
            Year:
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded bg-transparent text-white"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-white">
            Detail:
            <textarea
              name="detail"
              value={movieData.detail}
              onChange={handleChange}
              className="border px-2 py-1 w-full rounded bg-transparent text-white"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-white">
            Cast (comma-separated):
            <input
              type="text"
              name="cast"
              value={movieData.cast.join(", ")}
              onChange={(e) =>
                setMovieData({ ...movieData, cast: e.target.value.split(", ") })
              }
              className="border px-2 py-1 w-full rounded bg-transparent text-white"
            />
          </label>
        </div>

        <div className="mb-4">
          <label
            className="block text-white"
            style={
              !selectedImage
                ? {
                    border: "1px solid #888",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: "pointer",
                  }
                : {}
            }
          >
            {!selectedImage && "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={!selectedImage ? "hidden" : "block text-white"}
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleUpdateMovie}
            className="bg-teal-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            disabled={isUpdatingMovie || isUploadingImage}
          >
            {isUpdatingMovie || isUploadingImage
              ? "Updating..."
              : "Update Movie"}
          </button>

          <button
            type="button"
            onClick={handleDeleteMovie}
            className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            disabled={isUpdatingMovie || isUploadingImage}
          >
            {isUpdatingMovie || isUploadingImage
              ? "Deleting..."
              : "Delete Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMovie;
