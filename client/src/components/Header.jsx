import menu from "../assets/menu.svg";
import close from "../assets/close.svg";


import { Button} from "flowbite-react";
import {useState} from "react"
import { NavLink } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux"
import { FaMoon, FaSun } from "react-icons/fa"
import { toggleTheme } from "../redux/theme/themeSlice.js"
import { toggleUser, signOutSuccess, toggleUserExit} from "../redux/user/userSlice.js";
const Header = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { currentUser, visibleUser} = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
   
  const toggle = () => {
    setVisible(!visible);
  };


  
  const toggleProfile = () => {
   dispatch(toggleUser())
  };
  
const themeMode =()=>{
     dispatch(toggleTheme())
}

const handleSignout = () => {

  localStorage.removeItem("access_token");
  dispatch(signOutSuccess());
  console.log("Sign-out successful! ")
  dispatch(toggleUserExit());
};


  return (
    <>
    
      <div className=" fixed shadow-md  font-work  w-full z-[100] bg-white px-[12px] sm:px-[20px]   ">
      <div className=" cursor-pointer md:hidden  flex  mb-[-30px] sm:mb-[-40px] mt-[14px] sm:mt-[20px]  text-black  rounded-lg items-center justify-center  "
        onClick={themeMode}>
          {theme === "light"? <FaSun/> : <FaMoon /> }
        </div>
        <div  className="flex justify-between max-w-[1400px] m-auto  items-center py-[5px] sm:py-[15px] ">
        
        <div>
       
          <NavLink
            to="/"
            className="whitespace-nowrap  text-center self-center text-sm sm:text-xl font-semibold dark:text-white">
            <span className=" px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] mr-[5px] text-white rounded-lg ">
              Paul&#39;s 
            </span>
           <span> Blog </span>
          </NavLink>
        </div>
      
        <div className="hidden md:flex gap-x-[25px] font-[500] text-xl text-center ">
          <NavLink  to="/" className={({isActive}) => isActive ? "bg-[blue] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div >Home</div>
          </NavLink> 

          <NavLink to="/about"   className={({isActive}) => isActive ? "bg-[blue] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div >About</div>
          </NavLink>

          <NavLink to="/projects" className={({isActive}) => isActive ? "bg-[blue] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div>Blogs</div>
          </NavLink>

          {
              currentUser?.user?.isAdmin && (
                <NavLink to="/create-post" className={({isActive}) => isActive ? "bg-[blue] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
                <div>Add Blog</div>
              </NavLink>

              )

          }
        </div>
    
     
   
        <div className=" flex items-between justify-between ">
        


          <div className="flex md:hidden mr-[15px]  ">
            {!visible ? (
              <img className="max-w-[30px] cursor-pointer" src={menu} onClick={toggle} />
            ) : (
              <>
             
              <div className="absolute text-center text-lg h-screen w-screen z-[100] top-0 left-0 bg-black text-white opacity-95 pt-[20%]  ">
                <div>


                  
                  <img
                    onClick={toggle}
                    className=" mx-auto cursor-pointer"
                    src={close}
                  />
                </div>
                <NavLink to="/" >
                  <div onClick={toggle} className="mt-[20px] ">Home</div>
                </NavLink>

                <NavLink to="/about"  >
                  <div onClick={toggle} className="mt-[30px] ">About </div>
                </NavLink>
                
                <NavLink to="/projects">
                  <div onClick={toggle} className="mt-[30px] ">Blogs</div>
                </NavLink>

                {
                  currentUser?.user?.isAdmin && (
                    <NavLink to="/create-post">
                    <div onClick={toggle} className="mt-[30px] ">Add Blog</div>
                  </NavLink>
                  )
                }
  
              </div>

           
         
              </>
            )}
            
          </div>
          
          <div className=" cursor-pointer  inline md:flex hidden mt-[5px] mr-[10px] md:h-7 md:w-10 md:bg-black  text-black md:text-white rounded-lg items-center justify-center  "
        onClick={themeMode}>
          {theme === "light"? <FaSun/> : <FaMoon /> }
        </div>
        <div>
      



      
        { currentUser? (
          <div onClick={toggleProfile} >
          <img className="w-9 h-9 rounded-[50%]  object-cover cursor-pointer " src={currentUser? currentUser.user.profilePicture:"" } />
          
          </div>
        ) : (
            <NavLink to="/sign-in ">
            <Button className="bg-[blue]  border-[2px] border-[blue] hover:bg-transparent hover:text-[blue] rounded-lg  font-[500] cursor-pointer">
              Sign In
            </Button>
            </NavLink>
        ) }
        <div>
        {
          visibleUser? (
           <div className="absolute right-[5%] p-[20px] top-[65px] bg-white z-[100] sm:top-[85px] shadow-md rounded-md text-start  ">
           <div className=" truncate max-w-[180px] mb-[7px] "> {currentUser? currentUser.user.username:""}</div>
            <div className=" truncate max-w-[180px] mb-[17px] " > @{currentUser? currentUser.user.email:""}</div>
            <NavLink to="/dashboard?tab=profile ">
            <div onClick={toggleProfile}>
               Dashboard
            </div>
            </NavLink>
            <div onClick={handleSignout} className="mt-[7px] cursor-pointer">Sign Out</div>  
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
