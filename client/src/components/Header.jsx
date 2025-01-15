import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import image from "../assets/download.png"

import { Button} from "flowbite-react";
import {useState} from "react"
import { NavLink } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux"
import { FaMoon, FaSun } from "react-icons/fa"
import { toggleTheme } from "../redux/theme/themeSlice.js"

const Header = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const { currentUser} = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
   
  const toggle = () => {
    setVisible(!visible);
  };
  
  const toggleProfile = () => {
    setProfileMenu(!profileMenu);
  };
  
const themeMode =()=>{
     dispatch(toggleTheme())
}

  return (
    <>
    
      <div className="border-b-2 fixed w-full z-[100] bg-white  ">
        <div className="flex justify-between max-w-[1400px] m-auto  items-center px-[20px] py-[5px] sm:py-[15px] ">
        
        <div>
          <NavLink
            to="/"
            className="whitespace-nowrap  text-center self-center text-sm sm:text-xl font-semibold dark:text-white">
            <span className=" px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] text-white rounded-lg ">
              Paul&#39;s
            </span>
            Blog
          </NavLink>
        </div>
      
        <div className="hidden md:flex gap-x-[25px] font-[400] text-xl text-center ">
          <NavLink  to="/" offset={0} duration={500} className={({isActive}) => isActive ? "bg-[gray] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div className=" ">Home</div>
          </NavLink> 

          <NavLink to="/about"  offset={-150} duration={600} className={({isActive}) => isActive ? "bg-[gray] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div className=" ">About</div>
          </NavLink>

          <NavLink to="/projects"  offset={-120} duration={700} className={({isActive}) => isActive ? "bg-[gray] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div className=" ">Projects</div>
          </NavLink>
        </div>
        <div className=" cursor-pointer  flex md:h-7 md:w-10 md:bg-black text-black md:text-white rounded-lg items-center justify-center  "
        onClick={themeMode}>
          {theme === "light"? <FaSun/> : <FaMoon /> }
        </div>
     
   
        <div className=" flex ">
   
          <div className="flex md:hidden mr-[15px]  ">
            {!visible ? (
              <img className="max-w-[30px] cursor-pointer" src={menu} onClick={toggle} />
            ) : (
              <>
             
              <div className="absolute text-center text-lg h-screen w-screen z-[100] top-0 left-0 bg-[gray] text-white opacity-80 pt-[20%]  ">
                <div>
                  <img
                    onClick={toggle}
                    className=" mx-auto cursor-pointer"
                    src={close}
                  />
                </div>
                <NavLink to="/"  offset={-170} duration={500}>
                  <div onClick={toggle} className="mt-[20px] ">Home</div>
                </NavLink>

                <NavLink to="/about"  offset={-300} duration={500}>
                  <div onClick={toggle} className="mt-[30px] ">About </div>
                </NavLink>
                
                <NavLink to="/projects"  offset={-270} duration={500}>
                  <div onClick={toggle} className="mt-[30px] ">Projects</div>
                </NavLink>

              </div>
         
              </>
            )}
          </div>
        <div>
        { currentUser? (
          <div onClick={toggleProfile} className="w-9 h-9 rounded-[50%] cursor-pointer ">
          <img src={image} />
          
          </div>
        ) : (
            <NavLink to="/sign-in ">
            <Button className="bg-[blue] py-[8px] border-[2px] border-[blue] hover:bg-transparent hover:text-[blue] rounded-lg px-[12px] font-[500] cursor-pointer">
              Sign In
            </Button>
            </NavLink>
        ) }
        <div>
        {
          profileMenu? (
           <div className="absolute right-[5%] p-[20px] top-[65px] bg-white z-[100] sm:top-[85px] shadow-md rounded-md text-start  ">
           <div> { currentUser.user.username}</div>
            <div className=" truncate max-w-[180px] mb-[17px] " > @{ currentUser.user.email}</div>
            <NavLink to="/dashboard?tab=profile ">
            <div onClick={toggleProfile}>
               Dashboard
            </div>
            </NavLink>
            <div className="mt-[7px] cursor-pointer">Sign Out</div>  
           </div>
          ):(
           ""
          )
        }
        </div>
        </div>
        
        </div>
        
        </div>
      </div>
    </>
  );
};

export default Header;
