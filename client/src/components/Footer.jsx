import { NavLink } from "react-router-dom";

const Footer = () => {
 const year = new Date().getFullYear()

 

 const openFacebook = ()=>{
  window.open("https://m.facebook.com/profile.php?id=61567086932348", "_blank")
}
const openInstagram = ()=>{
window.open("https://www.instagram.com/adesinapaul8?igsh=MXhlbmw4bHF6ZDNmdg==", "_blank")
}

  return (
 
    <>
      <div className="w-full font-jakarta border-t-[0.5px] sticky text-white bg-black " >
        <div className="md:p-[70px] px-[12px] sm:p-[20px] max-w-[1400px] mb-[-30px] mt-[30px] m-auto">
            <div className="m-auto">
              <NavLink
                className="whitespace-nowrap text-xl font-bold dark:text-white"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] text-white rounded-lg">
                  Paul&#39;s
                </span>{" "}
                Blog
              </NavLink>
             
            </div>

            <div className="grid grid-cols-2 gap-3 mt-10 mb-[90px] md:grid-cols-3 md:gap-6 place-items-around ">
                <div>
                   <h1 className="text-lg font-[500] my-3 " >ABOUT </h1> 
                   <NavLink to="/projects" >  <div className="mb-2"> Projects</div>               </NavLink>

                   <NavLink to="/about" > <div>About</div>   </NavLink>
                 </div>

                 <div>
                   <h1 className="text-lg font-[500] my-3 " >FOLLOW US </h1> 
                   <div onClick={openFacebook}  className="mb-2 cursor-pointer ">Facebook</div>
                   <div onClick={openInstagram}  className="cursor-pointer " >Instagram </div>
                 </div>

                 <div>
                   <h1 className="text-lg font-[500] my-3 " >LEGAL</h1> 
                   <div className="mb-2">Privacy Policy</div>
                   <div>Terms & Conditions </div>
                 </div>

               
            </div>
            <div className="text-md mt-[40px] mb-[-10] md:mb-[-35px] text-center " >
                   &#169; {year} Paul&#39;s Blog
                </div>
        </div>




      </div>
    </>
  );
}

export default Footer;










