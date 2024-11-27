import { NavLink } from "react-router-dom";

const Footer = () => {
 const year = new Date().getFullYear()
  return (
 
    <>
      <div className="w-full border text-white bg-black " >
        <div className="md:p-[70px] p-[30px] max-w-[1000px] m-auto ">
            <div className="m-auto  ">
              <NavLink
                className="whitespace-nowrap text-xl font-bold dark:text-white"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-[blue] to-[gray] text-white rounded-lg">
                  Paul&#39;s
                </span>{" "}
                Blog
              </NavLink>
             
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 md:grid-cols-3 md:gap-6 place-items-around ">
                <div>
                   <h1 className="text-lg font-[500] my-3 " >ABOUT </h1> 
                   <div className="mb-2">100 JS Projects</div>
                   <div>Paul&#39;s Blog </div>
                 </div>

                 <div>
                   <h1 className="text-lg font-[500] my-3 " >FOLLOW US </h1> 
                   <div className="mb-2">Github</div>
                   <div>Discord </div>
                 </div>

                 <div>
                   <h1 className="text-lg font-[500] my-3 " >LEGAL</h1> 
                   <div className="mb-2">Privacy Policy</div>
                   <div>Terms & Conditions </div>
                 </div>

               
            </div>
            <div className="text-md mt-[40px] mb-[-20px] md:mb-[-55px] text-center " >
                   &#169; {year} Paul&#39;s Blog
                </div>
        </div>




      </div>
    </>
  );
}

export default Footer;










