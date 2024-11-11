import menu from "../assets/menu.svg";
import close from "../assets/close.svg";

import { Button } from "flowbite-react";
import {useState} from "react"
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon} from "react-icons/fa"


const Header = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!visible);
  };
  

  return (
    <>
    
      <div className="border-b-2 flex justify-between items-center px-[20px] py-[5px] sm:py-[15px] ">
        <div>
          <Link
            to="/"
            className="whitespace-nowrap self-center text-sm sm:text-xl font-semibold dark:text-white">
            <span className=" px-2 py-1 bg-gradient-to-r from-blue-500 to-gray-400 text-white rounded-lg ">
              Paul&#39;s
            </span>
            Blog
          </Link>
        </div>
        <div>
        {/* search bar */}
        </div>
        <div className="flex md:hidden ">
          <div>
            {!visible ? (
              <img className="max-w-[30px]" src={menu} onClick={toggle} />
            ) : (
              <div className="absolute top-[30px]  ">
                <div>
                  <img
                    onClick={toggle}
                    className="max-w-[20px] "
                    src={close}
                  />
                </div>
                <Link to="/" smooth={true} offset={-170} duration={500}>
                  <div onClick={toggle} className=" ">Home</div>
                </Link>

                <Link to="/about" smooth={true} offset={-300} duration={500}>
                  <div onClick={toggle} className=" ">About </div>
                </Link>
                
                <Link to="/projects" smooth={true} offset={-270} duration={500}>
                  <div onClick={toggle} className=" ">Projects</div>
                </Link>

              </div>
            )}
          </div>
        </div>
        <div className="hidden md:flex ">
          <Link to="/" smooth={true} offset={0} duration={500}>
            <div className=" ">Home</div>
          </Link> 

          <Link to="/about" smooth={true} offset={-150} duration={600}>
            <div className=" ">About</div>
          </Link>

          <Link to="/projects" smooth={true} offset={-120} duration={700}>
            <div className=" ">Projects</div>
          </Link>
        </div>

        <div>
          <button className=" flex lg:hidden active:bg-blue-500 bg-gray-400 items-center justify-center w-10 h-7 rounded-lg text-white ">
            <AiOutlineSearch />
          </button>
        </div>
        <div className=" cursor-pointer hidden sm:flex h-7 w-10 bg-gray-500 text-white rounded-lg items-center justify-center  ">
          <FaMoon />
        </div>
        <div>
        
          <Link to="/sign-in ">
          <Button className="bg-blue-500 py-[8px] rounded-lg px-[12px] font-[500] cursor-pointer">
            Sign In
          </Button>
          </Link>
        </div>
   
        
     
      </div>
    </>
  );
};

export default Header;
