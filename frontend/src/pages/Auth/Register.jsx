import { setCredentials } from "../../redux/features/auth/authSlice";

import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // Import useLocation hook to access current URL info (like path and query string)
  const { search } = useLocation();

  // Create a URLSearchParams instance with the search string (query string) from the URL
  // Example: if URL = http://localhost:3000/login?redirect=/profile
  // then search = "?redirect=/profile"
  const sp = new URLSearchParams(search); //It’s like a helper to read data from the query string.

  // Get the value of the 'redirect' query parameter from the URL
  // If it exists, it'll be like "/profile", "/dashboard" etc.
  // If it doesn't exist, fallback to "/"
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const registerHandler = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all inputs");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Registered successfully .");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <div>
      <section className="px-6 md:px-16 flex flex-wrap md:flex-nowrap">
        <div className="md:mr-16 mt-12 text-white w-full md:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

          <form onSubmit={registerHandler} className="w-full">
            <div className="my-8">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-2 border rounded w-full bg-transparent text-white"
                placeholder="Enter Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="my-8">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full bg-transparent text-white"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="my-8">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full bg-transparent text-white"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="my-8">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-2 border rounded w-full bg-transparent text-white"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer my-4 w-full"
            >
              {isLoading ? "Signing In ..." : "Sign In"}
            </button>
            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-white">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-teal-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="hidden xl:block h-[50rem] w-[48%] rounded-lg mt-8"
        />
      </section>
    </div>
  );
};

export default Register;
