import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiUser, HiArrowSmRight,HiDocumentText } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice.js";


const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } =  useSelector((state) => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  
  const handleSignout = () => {

    localStorage.removeItem("access_token");
    dispatch(signOutSuccess());
  
    console.log("Sign-out successful! ")
    
  };

  return (
    <div className="grid space-y-[15px]  max-w-[400px] md:w-[280px] m-auto  py-[15px] p-[12px] sm:p-[20px]">
      <NavLink to="/dashboard?tab=profile">
        <div
          className={`flex justify-between  p-[10px] border border-[gray] rounded-lg ${
            tab === "profile" ? "bg-[gray] text-white" : "hover:bg-[blue] hover:text-white"
          }`}
        >
          <div className="flex w-full items-center gap-x-[5px]">
            <HiUser />
            <h2>Profile</h2>
          </div>
          <div className="flex items-end  rounded-lg px-[11px] py-[2px] bg-[blue] text-white">
            { currentUser.user.isAdmin? "Admin": "User"}
          </div>
        </div>
      </NavLink>


     {
      currentUser.user.isAdmin &&(
        <div>
        <NavLink to="/dashboard?tab=posts">
        <div
          className={`flex justify-between p-[10px] border border-[gray] rounded-lg ${
            tab === "posts" ? "bg-[gray] text-white" : "hover:bg-[blue] hover:text-white"
          }`}
        >
          <div className="flex items-center gap-x-[5px]">
            <HiDocumentText />
            <h2>Posts</h2>
          </div>
        </div>
      </NavLink>
        </div>
      )

     }
     

      <div className="flex border border-[gray] items-center gap-x-[5px] hover:bg-[blue] cursor-pointer hover:text-white p-[10px] rounded-lg">
        <HiArrowSmRight />
        <h2 onClick={handleSignout} >Sign Out</h2>
      </div>
    </div>
  );
};

export default DashSidebar;
