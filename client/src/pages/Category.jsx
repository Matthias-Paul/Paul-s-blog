import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";

import uncategorise from "../assets/project.jpg";
import religion from "../assets/religion.jpeg";
import sport from "../assets/sport.jpg";
import health from "../assets/health.jpg";

const Category = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    console.log("Category:", category);
  }, [category]);

  const [posts, setPosts] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const fetchPosts = async ({ pageParam = 0 }) => {
    const postPerPage = 9;
    const startIndex = pageParam * postPerPage;

    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/post/get-post?category=${category}&startIndex=${startIndex}&limit=${postPerPage}`,
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
    queryKey: ["posts", category], // Ensure category is part of the query key
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length === 9 ? allPages.length : undefined,
  });

  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      setPosts(allPosts);
    }
  }, [data]); // Use `data` instead of `posts` to prevent unnecessary re-renders

  return (
    <>
      <div className="w-full font-work m-auto px-[12px] sm:px-[20px] mb-[20px]">
        <div className="max-w-[1400px] m-auto pt-[50px] sm:pt-[70px]">
          {/* Category Banners */}
          {category === "uncategorized" && (
            <CategoryBanner
                type="Uncategorized"
              image={uncategorise}
              title="Exploring Diverse Perspectives"
              description="Discover engaging stories, insightful discussions, and thought-provoking ideas beyond specific categories and boundaries."
            />
          )}
          {category === "sport" && (
            <CategoryBanner
            type="Sports"
              image={sport}
              title="The Spirit of Competition"
              description="Bringing you the latest updates, in-depth analysis, and inspiring stories from the world of sports and athletes."
            />
          )}
          {category === "health" && (
            <CategoryBanner
            type="Health"
              image={health}
              title="Your Path to Wellness"
              description="Empowering you with expert tips on fitness, nutrition, mental well-being, and a healthier lifestyle every day."
            />
          )}
          {category === "religion" && (
            <CategoryBanner
            type="Religion"
              image={religion}
              title="Faith and Inspiration"
              description="Exploring spiritual growth, religious teachings, and reflections to strengthen your faith and inspire daily life."
            />
          )}

          {/* Error & Loading States */}
          {isError && (
            <div className="text-red-500">Failed to load blogs. Please try again later.</div>
          )}
          {isLoading && <div className="text-green-500">Loading blogs...</div>}

          {/* Blog Posts Grid */}
          <div className="max-w-[500px] lg:max-w-[900px] xl:max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-[20px] m-auto">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Load More Button */}
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
  );
};

// Reusable Category Banner Component
const CategoryBanner = ({ image, title, description, type }) => (
    <div>
  <div className="relative text-white object-cover flex-shrink-0 max-w-[1400px] mb-[15px]">
    <img
      src={image}
      className="my-[10px] max-h-[700px] w-full object-cover flex-shrink-0 rounded-[8px] sm:rounded-[12px]"
      alt={title}
    />
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
      <h1 className="font-[700] px-[12px] text-[21px] sm:text-[35px] md:text-[55px] uppercase">
        {title}
      </h1>
      <p className="px-[12px] leading-[25px] font-[400] sm:font-[500] lg:leading-[40px] text-[18px] sm:text-[20px] lg:text-[35px] mt-[20px] max-w-[700px]">
        {description}
      </p>
    </div>
  </div>
<div  className=" mb-[10px] font-[600] text-[20px] sm:text-[30px] flex justify-center m-auto " > {type} Blogs </div>
  </div>
);

// Reusable Post Card Component
const PostCard = ({ post }) => (
  <div className="mb-[20px] p-[16px] border border-[#E8E8EA] rounded-[12px]">
    <NavLink to={`/post/${post.slug}`}>
      <div className="h-[285px] object-cover flex-shrink-0">
        <img className="rounded-[6px] w-full h-full object-cover flex-shrink-0" src={post.image} alt={post.title} />
      </div>

      <div
                                  className={`text-[14px] 
                                    ${post.category === "uncategorized" ? "max-w-[112px]" : ""}  
                                    ${post.category === "religion" ? "max-w-[71px]" : ""} 
                                    ${post.category === "sport" ? "max-w-[60px]" : ""}
                                    ${post.category === "health" ? "max-w-[62px]" : ""}
                                    text-start  first-letter:capitalize 
                                    font-medium text-[#4B6BFB] my-6 
                                    bg-[#4B6BFB0D] rounded-[6px] px-[10px] py-[4px]`}
                                >
                                  {post.category}
                                </div>
      <div className="line-clamp-3 opacity-[0.7] text-[22px] text-start sm:text-[26px] font-[600] mb-[24px] leading-[30px]">
        {post.title}
      </div>
      <div className="flex items-center text-[14px] sm:text-[16px] font-[500] text-[#97989F]">
      <div className=" object-cover flex-shrink-0  ">
       <img className="w-[40px] h-[40px] object-cover rounded-[50%]" src={post.profilePicture} alt="profile" />
       </div>
        <div  className="flex justify-between w-full ">

        <div className="ml-[7px] sm:ml-[10px]">{post.username}</div>
        <div>{new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </NavLink>
  </div>
);

export default Category;
