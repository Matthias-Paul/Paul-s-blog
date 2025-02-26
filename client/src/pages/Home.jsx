import heroImage from "../assets/homepage.jpg"
import {useSelector } from "react-redux"
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";


const Home = () => {

  const { currentUser } = useSelector(state => state.user)
  const { postSlug } = useParams();
  const [recentArticle, setRecentArticle] = useState([])

  const fetchRecentArticle = async () => {
   
    
    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/post/get-post?limit=9`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  };

  const { data: recentPost, isLoading, isError } = useQuery({
    queryKey: ["recentPost"],
    queryFn: fetchRecentArticle,
    
  });
  useEffect(() => {
    if (recentPost) {
      setRecentArticle(recentPost.posts);
      console.log(recentPost.posts)
    }
  }, [recentPost, postSlug ]);



  return (
    <>
      <div className="w-full font-work  m-auto px-[12px] sm:px-[20px] pb-[20px ] ">
        <div className=" max-w-[1400px] m-auto pt-[50px] sm:pt-[70px] " >
          <div className="relative text-white max-w-[1400px]  " >
            <img src={heroImage}  className="  my-[10px] w-full object-cover flex-shrink-0 rounded-[8px] sm:rounded-[12px] "  />
            <div className="absolute inset-0 flex flex-col justify-center left-2 md:left-2 lg:left-10 ">
                <h1 className="font-[700] text-[18px] sm:text-[25px] md:text-[30px] lg:text-[40px] xl:text-[50px] " > WELCOME TO MY BLOG  </h1>
                <p className=" leading-[18px] sm:leading-[25px] md:leading-[30px] lg:leading-[43px]  font-[400] sm:font-[500] text-[14px] sm:text-[18px] md:text-[20px] lg:text-[25px] mt-[4px] sm:mt-[10px] max-w-[200px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[650px] " > Explore expert insights on health, religion, and sports to stayed informed, inspired, and ahead in every aspect of life.   </p>
            </div> 
          </div>

        <div className="flex justify-between mb-[20px] mt-[20px] sm:mt-[28px] sm:mb-[15px] font-[500] text-[16px] sm:text-[18px] text-[blue] " >
         <div className=" text-[18px] md:text-[30px] " > Recent Blogs  </div>
         {
            
          currentUser?.user?.isAdmin && (
            <NavLink to= "/create-post" >
            <div className=" text-white bg-[blue] rounded-lg px-[13px] py-[4px] hover:bg-[gray] " > Add Blog  </div>
            </NavLink>
          )
         }

        </div>

{
   isError && (
    <div className="text-red-500 " >         Failed to load blog. Please try again later.
  </div>
   )
}

{
   isLoading && (
    <div className="text-green-500 " >         Loading blogs...    </div>
   )
}
        <div>

               <div className=" max-w-[500px]   lg:max-w-[900px] xl:max-w-[1400px] grid-cols-1 lg:grid-cols-2 grid xl:grid-cols-3 gap-x-[20px] m-auto">
                  
                  
                  {  recentArticle &&    recentArticle.map((article) => (

                              <div
                              className="mb-[20px] p-[16px] border border-color-[#E8E8EA]  rounded-[12px] "
                              key={article._id}
                            >
                              <NavLink to={`/post/${article.slug}`}>

                              <div className="h-[285px]   object-cover flex-shrink-0   " >
                                <img className="rounded-[6px] w-full h-full object-cover flex-shrink-0 " src={article.image} alt={article.title} />
                              </div>

                              <div className="text-[14px] text-center  first-letter:capitalize font-[500] text-[#4B6BFB]  my-[26px] bg-[#4B6BFB0D] rounded-[6px] px-[10px] py-[4px] ">
                              {article.category}

                              </div>
            
                              <div className=" line-clamp-3  text-[22px] text-start  sm:text-[26px] font-[600] mb-[24px] leading-[30px]">
                                {article.title}
                              </div>

                              <div className="flex items-center text-[14px] sm:text-[16px] font-[500] text-[#97989F] ">
                                <div className=" object-cover flex-shrink-0  ">
                                  <img 
                                    className="w-[40px] h-[40px] object-cover rounded-[50%]  "
                                    src={article.profilePicture}
                                    alt="profile"/>
                                </div>
                                <div  className="flex justify-between w-full ">
                                <div className=" ml-[7px]  sm:ml-[10px]  ">{article.username}</div>
                                <div className="  ">
                                {new Date(article.createdAt).toLocaleDateString()}


                                </div>
                                
                                </div>

                              </div>

                              </NavLink>

                            </div>





                            ))



                  }

                  </div>
{
    recentArticle.length > 0 && (
   <NavLink to="/projects" >  
     <button className="underline my-[30px] m-auto flex justify-center text-green-500 cursor-pointer" > View All Posts
       </button>
</NavLink>

    ) 

}
          
          </div> 



        </div> 
      </div>
    </>
  )
}

export default Home
