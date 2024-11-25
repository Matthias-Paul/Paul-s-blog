import { NavLink } from "react-router-dom";

const SignUp = () => {
  return (
    <>
      <div className="min-h-screen pt-20 flex items-center p-5 sm:p-8 ">
        <div className="md:flex justify-center m-auto md:space-x-[50px] ">
          {/*   left content */}
          <div className=" m-auto ">
            <div>
              <NavLink
                to="/"
                className="whitespace-nowrap  text-3xl font-bold dark:text-white"
              >
                <span className=" px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] text-white rounded-lg ">
                  Paul&#39;s
                </span>
                Blog
              </NavLink>
              <p className=" pt-5 max-w-[95%] ">
                {" "}
                You can sign up with your email and password or with or with
                Google.
              </p>
            </div>
          </div>
          {/* right content */}
          <div className="md:mt-0 mt-5 md:text-lg">
            <form>

              <div className=" flex flex-col  ">
                <label htmlFor="username">Your Username</label>
                <input
                  required  
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="w-full md:w-[370px] rounded-lg border border-color-[gray] mt-[6px] "
                />
              </div>

              <div className=" flex flex-col mt-[12px] ">
                <label htmlFor="email">Your Email</label>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="w-full md:w-[370px] rounded-lg border border-color-[gray] mt-[6px] "
                />
              </div>

              <div className=" flex flex-col mt-[12px] ">
                <label htmlFor="password">Your Password</label>
                <input
                  required
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="w-full md:w-[370px] rounded-lg border border-color-[gray] mt-[6px] "
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
