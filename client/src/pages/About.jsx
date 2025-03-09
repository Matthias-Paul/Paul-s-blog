import profile from "../assets/about.jpg"
import {FaFacebook, FaInstagram, FaTwitter, FaWhatsapp  } from "react-icons/fa"

const About = () => {


  const openFacebook = ()=>{
      window.open("https://m.facebook.com/profile.php?id=61567086932348", "_blank")
  }
  const openInstagram = ()=>{
    window.open("https://www.instagram.com/adesinapaul8?igsh=MXhlbmw4bHF6ZDNmdg==", "_blank")
}
const openTwitter = ()=>{
  window.open("https://x.com/MatthiasPaul200?s=09", "_blank")
}
const openWhatsapp = ()=>{
  window.open("https://wa.me/2348054696701", "_blank")
}


  return (
    <>
      <div className="w-full font-work  m-auto px-[12px] sm:px-[20px] pb-[20px ] " >
        <div className=" max-w-[1400px] m-auto pt-[50px] sm:pt-[70px] "  >
        <div className="bg-[gray] rounded-[8px] mt-[10px] sm:rounded-[12px]  " >

        <div className="max-w-[900px] px-[7px] p-[25px] md:p-[90px] m-auto text-white "  >
          <div className="flex justify-between py-[15px] items-center font-[500] text-[15px] sm:text-[25px]  w-full " >
            <div className=" flex items-center gap-x-[5px] "   >
          <img className="flex-shrink-0 object-cover rounded-[50%] w-[40px] h-[40px]  " src={profile}  />
          <div> Adesina Paul   </div>
          </div>

          <div> MERN stack developer  </div>
          </div>  
       
         <p className="  text-[15px] font-[500] sm:text-[20px] leading-[25px] md:leading-[35px] " > MEET PAUL: A passionate  MERN stack developer, but beyond coding, i have a deep interest in religion, sport and health. That&#39;s why i created Paul&#39;s Blog- a space where i share insights, stories and reflections on these topics. </p>


         <div className="text-white mt-[30px] flex justify-between text-[30px]  " > 
          <FaFacebook onClick={openFacebook} className="cursor-pointer " />
          <FaInstagram onClick={openInstagram} className="cursor-pointer "  />
          <FaTwitter onClick={openTwitter} className="cursor-pointer "  />
          <FaWhatsapp onClick={openWhatsapp} className="cursor-pointer "  />

        </div>
        </div> 

          

        </div>

        <div className=" max-w-[700px] m-auto py-[30px]  pb-[60px] " >
        <h1 className=" text-[22px] sm:text-[30px] font-[600] sm:font-[700] my-[5px]  " > Meet Paul: A Passionate MERN Stack Developer </h1> 
        <p className=" mb-[10px] text-[16px] sm:text-[18px] " >Paul is a MERN stack developer with a strong passion for building products. Whether developing seamless React interfaces, designing efficient Node.js and Express.js backends, or managing data with MongoDB, Paul is always eager to innovate and create scalable web applications. His ability to write clean, maintainable code and optimize performance ensures that his applications run smoothly and efficiently.  </p>
         <h2 className=" text-[22px] sm:text-[25px] font-[500] my-[10px] sm:my-[15px] " > From Code to Craft: A Journey in Tech </h2>
          <p className=" mb-[10px] text-[16px] sm:text-[18px] " > Paul&#39;s journey in tech is diverse. As a computer science student, he has explored fundamental concepts like the Chomsky hierarchy, while also applying his skills in real-world development. His expertise in the MERN stack allows him to build dynamic and efficient full-stack solutions, bridging the gap between frontend and backend technologies. Over time, he has developed a deep understanding of RESTful APIs, authentication, and database management, making him a well-rounded developer capable of handling complex applications. </p>

      <h2 className=" text-[22px] sm:text-[25px] font-[500] my-[10px] sm:my-[15px] " > Crafting Seamless Digital Experiences  </h2>
      <p className=" mb-[10px] text-[16px] sm:text-[18px] " > Paul&#39;s full-stack development skills shine in projects like his blog website, where he implemented Redux Toolkit for state management, search functionality, and a backend powered by Express.js and MongoDB. His ability to integrate frontend and backend components ensures smooth and responsive user experiences. He has also worked on responsive UI designs using Tailwind CSS, ensuring that his applications function flawlessly across different devices.

            Beyond building applications, Paul is always looking for ways to improve performance, enhance security, and optimize the user experience. Whether it's implementing caching mechanisms, handling server-side rendering, or working with cloud deployment services, he strives to create applications that are both efficient and scalable. </p>
       <h2 className=" text-[22px] sm:text-[25px] font-[500] my-[10px] sm:my-[15px] " > Passion for Learning and Growth </h2>
       <p className=" mb-[10px] text-[16px] sm:text-[18px] " > Paul is constantly improving his skills, whether by reading books like Rich Dad Poor Dad or mastering Git and GitHub for version control. His continuous learning mindset makes him a dynamic developer ready to tackle new challenges. He actively follows industry trends, staying up to date with the latest frameworks, best coding practices, and emerging technologies.

        Paul also enjoys collaborating with other developers, contributing to open-source projects, and sharing his knowledge with the tech community. His ability to adapt and learn quickly has helped him refine his problem-solving skills, making him a valuable asset in any development team. </p>

     <h1 className=" text-[22px] sm:text-[30px] font-[600] sm:font-[700] my-[5px]  " >What&#39;s Next for Paul?  </h1>
     <p className=" pb-[10px] text-[16px] sm:text-[18px] " > With a strong foundation in MERN stack development, Paul is on a path to making a significant impact in the tech industry. Whether you're looking for a skilled full-stack developer, a problem solver, or someone who can bring fresh ideas to the table, Paul is someone to watch. His dedication to writing clean code, optimizing performance, and delivering high-quality applications sets him apart as a developer committed to excellence. </p>

        </div>  


        </div>  
      </div>
    </>
  )
}

export default About
