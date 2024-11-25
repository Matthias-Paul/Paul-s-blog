import menu from "../assets/menu.svg";
import close from "../assets/close.svg";

import { Button } from "flowbite-react";
import {useState} from "react"
import { NavLink } from "react-router-dom";

import { FaMoon} from "react-icons/fa"


const Header = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!visible);
  };
  

  return (
    <>
    
      <div className="border-b-2 fixed w-full z-100 bg-white  ">
        <div className="flex justify-between max-w-[1300px] m-auto  items-center px-[20px] py-[5px] sm:py-[15px] ">
        
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
          <NavLink  to="/" smooth={true} offset={0} duration={500} className={({isActive}) => isActive ? "bg-[gray] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div className=" ">Home</div>
          </NavLink> 

          <NavLink to="/about" smooth={true} offset={-150} duration={600} className={({isActive}) => isActive ? "bg-[gray] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div className=" ">About</div>
          </NavLink>

          <NavLink to="/projects" smooth={true} offset={-120} duration={700} className={({isActive}) => isActive ? "bg-[gray] pb-[3px] text-white rounded-lg px-[12px]" : ""} >
            <div className=" ">Projects</div>
          </NavLink>
        </div>
        <div className=" cursor-pointer hidden md:flex h-7 w-10 bg-black text-white rounded-lg items-center justify-center  ">
          <FaMoon />
        </div>
     
   
        <div className=" flex ">
   
          <div className="flex md:hidden mr-[15px]  ">
            {!visible ? (
              <img className="max-w-[30px] cursor-pointer" src={menu} onClick={toggle} />
            ) : (
              <>
             
              <div className="absolute text-center text-lg h-screen w-screen top-0 left-0 bg-[gray] text-white opacity-80 pt-[20%]  ">
                <div>
                  <img
                    onClick={toggle}
                    className=" mx-auto cursor-pointer"
                    src={close}
                  />
                </div>
                <NavLink to="/" smooth={true} offset={-170} duration={500}>
                  <div onClick={toggle} className="mt-[20px] ">Home</div>
                </NavLink>

                <NavLink to="/about" smooth={true} offset={-300} duration={500}>
                  <div onClick={toggle} className="mt-[30px] ">About </div>
                </NavLink>
                
                <NavLink to="/projects" smooth={true} offset={-270} duration={500}>
                  <div onClick={toggle} className="mt-[30px] ">Projects</div>
                </NavLink>

              </div>
         
              </>
            )}
          </div>
          <div>
        
          <NavLink to="/sign-in ">
          <Button className="bg-[blue] py-[8px] border-[2px] border-[blue] hover:bg-transparent hover:text-[blue] rounded-lg px-[12px] font-[500] cursor-pointer">
            Sign In
          </Button>
          </NavLink>
        </div>
        
        </div>
        
        </div>
      </div>
    </>
  );
};

export default Header;
