import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Signup successful!" });
        setTimeout(() => navigate("/sign-in"), 2000); // Redirect after 2 seconds
      } else if ( data.message && data.message.includes("ENOTFOUND")) { 
        setMessage({ type: "error", text: "Signup failed, check your internet connection!" });
      } else { 
        setMessage({ type: "error", text: data.message || "Signup failed!" });
      }

    } catch (error) {
      console.error(error.message);
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20 flex items-center p-5 sm:p-8">
        <div className="md:flex justify-center m-auto md:space-x-[50px]">
          {/* Left Content */}
          <div className="m-auto">
            <div>
              <NavLink
                to="/"
                className="whitespace-nowrap text-3xl font-bold dark:text-white"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] text-white rounded-lg">
                  Paul&#39;s
                </span>{" "}
                Blog
              </NavLink>
              <p className="pt-5 max-w-[95%]">
                Sign up with your email and password or with Google.
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:mt-0 mt-5 md:text-lg">
            <form onSubmit={handleSubmission}>
              <div className="flex flex-col">
                <label htmlFor="username">Your Username</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Username"
                  id="username"
                  value={formData.username}
                  className="w-full md:w-[370px] rounded-lg border border-gray-300 mt-[6px]"
                />
              </div>

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
                  placeholder="Password"
                  id="password"
                  value={formData.password}
                  className="w-full md:w-[370px] rounded-lg border border-gray-300 mt-[6px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-[370px] p-[10px] text-lg rounded-lg font-[500] text-white mt-[30px] cursor-pointer ${
                  loading ? "bg-gray-400" : "bg-[blue] hover:bg-gray-600"
                }`}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              {message && (
                <div
                  className={`mt-[10px] text-left text-lg ${
                    message.type === "success" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="mt-[5px] text-[15px]">
                <span>Have an account?</span>
                <NavLink className="text-[blue] ml-[10px]" to="/sign-in">
                  Sign in
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
