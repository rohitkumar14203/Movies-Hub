import { useGetUsersQuery } from "../../../../redux/api/userApiSlice";

const PrimaryCard = () => {
  const { data: users } = useGetUsersQuery();
  return (
    <div className="w-[100%] h-[10%]  bg-[#282828] text-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
      <p>You have {users?.length} new users, watching your content.</p>
    </div>
  );
};

export default PrimaryCard;
