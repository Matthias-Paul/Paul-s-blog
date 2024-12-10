import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import DashSidebar from "../components/DashSidebar.jsx"
import DashProfile from "../components/DashProfile.jsx"

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
    <div className="m-auto max-w-[1400px] " >
      <div className=" pt-[46px] mx-auto sm:pt-[67px] min-h-screen  flex flex-col md:flex-row">
      <div className=" md:w-[20rem]  shadow-md  border-[0.5px] ">
          <DashSidebar />
        </div>
        <div className=" mt-8 ">
          { tab ==="profile" && <DashProfile />}
        </div>
      </div>
      </div>
    </>
  )
}

export default Dashboard
