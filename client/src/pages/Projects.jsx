import project from "../assets/project.jpg"
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";





const Projects = () => {


  const [posts, setPosts] = useState([])


  const { currentUser } = useSelector((state) => state.user);

  const fetchPosts = async ({ pageParam = 0 }) => {
    const postPerPage = 9;
    const startIndex = pageParam * postPerPage;


    const res = await fetch( `https://paul-s-blog.onrender.com/api/post/get-post?startIndex=${startIndex}&limit=${postPerPage}`,
        {
            
            method: "GET",
            headers: {
              "Content-Type": "application/json",
          
            },
        }
     );
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  };

// Use useInfiniteQuery for paginated data
const {
  data,
  isLoading,
  isError,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  getNextPageParam: (lastPage, allPages) =>
    lastPage.posts.length === 9 ? allPages.length : undefined,
 
});

useEffect(() => {
  if (data) {
    const allPosts = data.pages.flatMap((page) => page.posts);
    const uniquePosts = Array.from(new Map(allPosts.map((p) => [p._id, p])).values());
    setPosts(uniquePosts);
  }
}, [data]);



  return (
    <>
      <div className="w-full font-work  m-auto px-[12px] sm:px-[20px] mb-[20px ] ">
        <div className=" max-w-[1400px] m-auto pt-[50px] sm:pt-[70px] " >

        <div className="relative text-white w-full object-cover flex-shrink-0 max-w-[1400px] mb-[50px] " >
            <img src={project}  className=" my-[10px] max-h-[650px]  w-full object-cover flex-shrink-0 rounded-[8px]  sm:rounded-[12px] "  />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center ">
                <h1 className="font-[700] px-[12px] text-[21px] sm:text-[35px] md:text-[55px] " > PAUL&#39;S BLOG: FAITH, FITNESS AND SPORT INSIGHTS     </h1>
                <p className=" px-[12px] leading-[25px]  font-[400] sm:font-[500] lg:leading-[40px] text-[18px] sm:text-[20px] lg:text-[35px]  mt-[20px] max-w-[700px] " >
                  Stay informed with inspiring religious content, health tips and the latest sports updates
                     </p>
                     {
              !currentUser?.user && (
                <div className=" flex mt-[15px] md:mt-[25px] gap-x-[4px] md:gap-x-[10px] " >
                  <NavLink to="/sign-up" >
                  <button className=" px-4 text-[18px] md:text-[25px] font-[500] py-1 bg-gradient-to-r from-[blue] to-[gray] mr-[5px] text-white rounded-lg " > SIGN UP </button>

                  </NavLink>  
                  <NavLink to="/sign-in" >
                  <button className=" px-4 text-[18px] md:text-[25px] font-[500] py-1 bg-gradient-to-r from-[blue] to-[gray] mr-[5px] text-white rounded-lg " > SIGN IN </button>

                  </NavLink> 
                </div>  
              )
            }           
           
            </div> 
          </div>


          {
   isError && (
    <div className="text-red-500 " >         Failed to load blogs. Please try again later.
  </div>
   )
}

{
   isLoading && (
    <div className="text-green-500 " >         Loading blogs...    </div>
   )
}
   


          <div className=" max-w-[500px]   lg:max-w-[900px] xl:max-w-[1400px] grid-cols-1 lg:grid-cols-2 grid xl:grid-cols-3 gap-x-[20px] m-auto">
                  
                  
                  {  posts &&    posts.map((post) => (

                     <PostCards key={post._id}  post={post} />

                            ))



                  }

                 

                  </div>


                  {hasNextPage && (
                <div className="flex justify-center items-center">
                  <button
                    className="bg-[blue] px-[20px] my-[30px] py-[7px] rounded-lg text-white hover:bg-[gray] cursor-pointer"
                    onClick={() => fetchNextPage()}
                 >
                    {isFetchingNextPage ? "Loading more..." : "Load more"}
                  </button>
                </div>
              )}


        </div>  
      </div>
    </>
  )
}

const PostCards = ({ post }) => (

  <div
            className="mb-[20px] p-[16px] border border-color-[#E8E8EA]  rounded-[12px] "
         
          >
            <NavLink to={`/post/${post.slug}`}>

            <div className="h-[285px]   object-cover flex-shrink-0   " >
              <img className="rounded-[6px] w-full h-full object-cover flex-shrink-0 " src={post.image} alt={post.title} />
            </div>

            <div
                                  className={`text-[14px] 
                                    ${post.category === "uncategorized" ? "max-w-[112px]" : ""}  
                                    ${post.category === "religion" ? "max-w-[71px]" : ""} 
                                    text-start max-w-[60px] first-letter:capitalize 
                                    font-medium text-[#4B6BFB] my-6 
                                    bg-[#4B6BFB0D] rounded-[6px] px-[10px] py-[4px]`}
                                >
                                  {post.category}
                                </div>


            <div className=" line-clamp-3  text-[22px] text-start opacity-[0.7]  sm:text-[26px] font-[600] mb-[24px] leading-[30px]">
              {post.title}
            </div>

            <div className="flex items-center text-[14px] sm:text-[16px] font-[500] text-[#97989F] ">
              <div className=" object-cover flex-shrink-0  ">
                <img 
                  className="w-[40px] h-[40px] object-cover rounded-[50%]  "
                  src={post.profilePicture}
                  alt="profile"/>
              </div>
              <div  className="flex justify-between w-full ">
              <div className=" ml-[7px]  sm:ml-[10px]  ">{post.username}</div>
              <div className="  ">
              {new Date(post.createdAt).toLocaleDateString()}


              </div>
              
              </div>

            </div>

            </NavLink>

          </div>





)




export default Projects
