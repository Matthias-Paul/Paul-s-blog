import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import DashSidebar from "../components/DashSidebar.jsx"
import DashProfile from "../components/DashProfile.jsx"
import DashPosts from "../components/DashPosts.jsx"

const Dashboard = () => {
  const location = useLocation();

   const [tab, setTab] = useState("")

   useEffect(()=>{
     const urlParams = new URLSearchParams(location.search)
     const tabFromURL = urlParams.get("tab")
    if (tabFromURL){
      setTab(tabFromURL)
    }

   },[location.search])

  return (
    <>
    <div className="m-auto  max-w-[1400px] " >
      <div className=" pt-[46px]  mx-auto sm:pt-[67px] min-h-screen  flex flex-col md:flex-row">
      <div className=" md:max-w-[18rem] h-full  md:fixed shadow-md border md:border-[0px] md:border-r-[0.5px] ">
          <DashSidebar />
        </div>
        <div className=" mt-6 flex flex-col items-center w-full ">

          { tab ==="profile" && <DashProfile />}

          { tab ==="posts" && <DashPosts />}
        </div>
      </div>
      </div>
    </>
  )
}

export default Dashboard
