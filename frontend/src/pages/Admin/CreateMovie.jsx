import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/moviesApiSlice";

import { useFetchGenreQuery } from "../../redux/api/genreApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const { data: genre, isLoading: isLoadingGenres } = useFetchGenreQuery();

  useEffect(() => {
    if (genre && genre.length > 0) {
      setMovieData((prev) => ({
        ...prev,
        genre: genre[0]._id,
      }));
    }
  }, [genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovieData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCreateMovie = async () => {
    if (
      !movieData.name ||
      !movieData.year ||
      !movieData.detail ||
      !movieData.cast.length ||
      !selectedImage
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Upload image first
      const formData = new FormData();
      formData.append("image", selectedImage);

      const uploadImageResponse = await uploadImage(formData).unwrap();

      const uploadedImagePath = uploadImageResponse.image;

      // Create movie
      await createMovie({
        ...movieData,
        image: uploadedImagePath,
      }).unwrap();

      toast.success("Movie created successfully!");
      navigate("/admin/movies-list");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create movie");
    }
  };

  return (
    <div className="container flex justify-center items-center mt-4">
      <form>
        <p className="text-green-200 w-[50rem] text-2xl mb-4">Create Movie</p>

        <div className="mb-4">
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={movieData.name}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block">Year:</label>
          <input
            type="number"
            name="year"
            value={movieData.year}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block">Detail:</label>
          <textarea
            name="detail"
            value={movieData.detail}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block">Cast (comma-separated):</label>
          <input
            type="text"
            value={movieData.cast.join(", ")}
            onChange={(e) =>
              setMovieData({
                ...movieData,
                cast: e.target.value.split(", ").filter((item) => item),
              })
            }
            className="border px-2 py-1 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block">Genre:</label>
          <select
            name="genre"
            value={movieData.genre}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          >
            {isLoadingGenres ? (
              <option>Loading genres...</option>
            ) : (
              genre?.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mb-4">
          <label
            style={
              !selectedImage
                ? {
                    border: "1px solid #888",
                    borderRadius: "5px",
                    padding: "8px",
                  }
                : {}
            }
          >
            {!selectedImage && "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: !selectedImage ? "none" : "block" }}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleCreateMovie}
          className="bg-teal-500 text-white px-4 py-2 rounded"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
