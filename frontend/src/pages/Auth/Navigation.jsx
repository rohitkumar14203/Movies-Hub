import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../redux/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  // Dummy logoutHandler placeholder (you can wire your real one here)
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logout Successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }

    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="fixed text-white bottom-10 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50 bg-[#0f0f0f] border w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] px-4 sm:px-8 md:px-12 mb-8 rounded">
      <section className="flex justify-between items-center">
        {/* Section 1 */}
        <div className="flex justify-center items-center mb-8">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-1"
          >
            <AiOutlineHome className="mr-2 mt-12" size={24} />
            <span className="hidden nav-item-name mt-12">Home</span>
          </Link>

          <Link
            to="/movies"
            className="flex items-center transition-transform transform hover:translate-x-1 ml-4"
          >
            <MdOutlineLocalMovies className="mr-2 mt-12" size={24} />
            <span className="hidden nav-item-name mt-12">SHOP</span>
          </Link>
        </div>

        {/* Section 2 */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-800 focus:outline-none"
          >
            {userInfo && (
              <span className="text-white">{userInfo.username}</span>
            )}

            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  dropdownOpen ? "transform rotate-360" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 mr-8 w-40 space-y-2 bg-white text-gray-600 ${
                !userInfo.isAdmin ? "-top-20" : "-top-24"
              }`}
            >
              {userInfo.isAdmin && (
                <li>
                  <Link
                    to="/admin/movies/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </li>

              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo && (
            <ul className="flex">
              <li>
                <Link
                  to="/login"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-1 mb-8"
                >
                  <AiOutlineLogin className="mr-2 mt-1" size={24} />
                  <span className="hidden nav-item-name">LOGIN</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-1 ml-4"
                >
                  <AiOutlineUserAdd size={24} />
                  <span className="hidden nav-item-name">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;
