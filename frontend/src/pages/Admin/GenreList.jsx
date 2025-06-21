import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useFetchGenreQuery,
} from "../../redux/api/genreApiSlice";

import GenreForm from "../../components/GenreForm";
import Modal from "../../components/Modal";


const GenreList = () => {
  const { data: genres, refetch } = useFetchGenreQuery();

  const [name, setName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createGenre] = useCreateGenreMutation();

  const [updateGenre] = useUpdateGenreMutation();

  const [deleteGenre] = useDeleteGenreMutation();

  const handleCreateGenre = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Genre name is required");
      return;
    }
    try {
      const result = await createGenre({ name }).unwrap();
      setName("");
      toast.success(`${result.name} is created`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("creating genre failed, try again");
    }
  };

  // This function handles the update action for a genre when the Update button is clicked inside the modal
  const handleUpdateGenre = async (e) => {
    // Prevent the default form submission behavior (like page reload)
    e.preventDefault();

    // If the updatedName input is empty, show an error toast and stop further execution
    if (!updatedName) {
      toast.error("Genre name is required");
      return;
    }

    try {
      // Call the RTK Query mutation function 'updateGenre'
      // It takes an object with two properties:
      // 1. 'id' - the id of the selected genre we want to update
      // 2. 'updateGenre' - an object containing the updated data we want to send to the server (body)
      // This 'updateGenre' key matches the destructured key in genreApiSlice.js
      // Inside genreApiSlice.js:
      // query: ({ id, updateGenre })
      // So here we pass: updateGenre:{ name: updatedName } as the new data
      const result = await updateGenre({
        id: selectedGenre._id, // Genre's ID to identify which genre to update
        updateGenre: { name: updatedName }, // Body to send in PUT request to update name
      }).unwrap(); // unwrap() converts the response to plain JS object and allows catching errors in try-catch

      // Show a success toast with the updated genre name from server response
      toast.success(`${result.name} is updated`);

      // Refetch the genre list again to update the UI with fresh data
      refetch();

      // Reset the selectedGenre state to null since update is done
      setSelectedGenre(null);

      // Clear the updatedName input box
      setUpdatedName("");

      // Close the update modal after successful update
      setModalVisible(false);
    } catch (error) {
      // If any error occurs during the API call, log it in console for debugging
      console.error(error);

      // Show a toast notification to the user about the failure
      toast.error("Updating genre failed, try again");
    }
  };

  const handleDeleteGenre = async (e) => {
    e.preventDefault();

    try {
      const result = await deleteGenre(selectedGenre._id).unwrap();

      toast.success(`${result.name} is deleted`);
      refetch();
      setSelectedGenre(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Genre deletion failed. Tray again.");
    }
  };

  return (
    <div className="ml-0 md:ml-[10rem] flex flex-col md:flex-row p-4">
      <div className="w-full md:w-3/4 p-3">
        <h1 className="text-2xl font-semibold mb-4">Manage Genres</h1>

        {/* Create Genre Form */}
        <GenreForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateGenre}
        />

        <br />

        {/* Genre Buttons */}
        <div className="flex flex-wrap gap-2">
          {genres?.map((genre) => (
            <div key={genre._id}>
              <button
                onClick={() => {
                  setModalVisible(true);
                  setSelectedGenre(genre);
                  setUpdatedName(genre.name);
                }}
                className="bg-white border border-teal-500 text-teal-500 py-2 px-4 rounded-lg hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition"
              >
                {genre.name}
              </button>
            </div>
          ))}
        </div>

        {/* Modal for Update/Delete */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <GenreForm
            value={updatedName}
            setValue={(value) => setUpdatedName(value)}
            handleSubmit={handleUpdateGenre}
            buttonText="Update"
            handleDelete={handleDeleteGenre}
          />
        </Modal>
      </div>
    </div>
  );
};

export default GenreList;
