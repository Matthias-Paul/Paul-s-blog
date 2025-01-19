import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localMessage, setLocalMessage] = useState(null); // Local message state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    setLocalMessage(null); // Clear previous messages

    try {
      const res = await fetch("https://paul-s-blog.onrender.com/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        console.log(data);
        localStorage.setItem("access_token", data.token);
        console.log(data.token)
        setLocalMessage("Sign in successful!");
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
      } else if (data.message) {
        // Handle specific error messages
        if (data.message.includes("ENOTFOUND") || data.message.includes("Operation")) {
          dispatch(signInFailure("Sign-in failed. Check your internet connection!"));
        } else {
          dispatch(signInFailure(data.message));
        }
      } else {
        dispatch(signInFailure("Sign-in failed!"));
      }
    } catch (error) {
      dispatch(signInFailure("An unexpected error occurred. Please try again."));
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center p-5 sm:p-8">
      <div className="md:flex justify-center m-auto md:space-x-[50px]">
        <div className="m-auto">
          <NavLink className="whitespace-nowrap text-3xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] text-white rounded-lg">
              Paul&#39;s
            </span>{" "}
            Blog
          </NavLink>
          <p className="pt-5 max-w-[95%]">Sign in with your email and password or with Google.</p>
        </div>

        <div className="md:mt-0 mt-5 md:text-lg">
          <form onSubmit={handleSubmission}>
            <div className="flex flex-col mt-[12px]">
              <label htmlFor="email">Your Email</label>
              <input
                onChange={handleChange}
                type="email"
                placeholder="name@company.com"
                id="email"
                value={formData.email}
                className="w-full md:w-[370px] rounded-lg border border-gray-300 mt-[6px]"
              />
            </div>

            <div className="flex flex-col mt-[12px]">
              <label htmlFor="password">Your Password</label>
              <input
                onChange={handleChange}
                type="password"
                placeholder="********"
                id="password"
                value={formData.password}
                className="w-full md:w-[370px] rounded-lg border border-gray-300 mt-[6px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-[370px] p-[10px] text-lg rounded-lg font-[500] text-white mt-[30px] cursor-pointer ${
                loading ? "bg-[gray]" : "bg-[blue] hover:bg-[gray]"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

              <OAuth/>    {/* google OAuth button   */}

            {/* Display success or error messages */}
            {(localMessage ) && (
              <div className={`mt-[10px] text-left text-lg ${localMessage ? "text-green-500" : "text-red-500"}`}>
                {localMessage }
              </div>
            )}

            <div className="mt-[5px] text-[15px]">
              <span>Don&#39;t have an account?</span>
              <NavLink className="text-[blue] ml-[10px]" to="/sign-up">
                Sign up
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
