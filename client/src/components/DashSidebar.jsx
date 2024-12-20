import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { NavLink } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className="grid space-y-[12px]  p-[20px]">
      <NavLink to="/dashboard?tab=profile">
        <div
          className={`flex justify-between p-[10px] rounded-lg ${
            tab === "profile" ? "bg-[gray] text-white" : "hover:bg-[gray] hover:text-white"
          }`}
        >
          <div className="flex items-center gap-x-[5px]">
            <HiUser />
            <h2>Profile</h2>
          </div>
          <div className="flex items-end rounded-lg px-[11px] py-[2px] bg-[blue] text-white">
            User
          </div>
        </div>
      </NavLink>
      <div className="flex items-center gap-x-[5px] hover:bg-[gray] cursor-pointer hover:text-white p-[10px] rounded-lg">
        <HiArrowSmRight />
        <h2>Sign Out</h2>
      </div>
    </div>
  );
};

export default DashSidebar;
