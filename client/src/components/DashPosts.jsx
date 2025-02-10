import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import close from "../assets/close.svg";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [showModel, setShowModel] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null); // Store selected post ID

  const openModel = (postId) => {
    setSelectedPostId(postId); // Set the selected post ID
    setShowModel(true);
  };

  const closeModel = () => {
    setShowModel(false);
    setSelectedPostId(null); // Clear the selected post ID
  };

  // Define the fetch function for posts
  const fetchPosts = async ({ pageParam = 0 }) => {
    const postsPerPage = 9;
    const startIndex = pageParam * postsPerPage;

    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/post/get-post?userId=${currentUser.user._id}&startIndex=${startIndex}&limit=${postsPerPage}`
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
    queryKey: ["posts", currentUser.user._id],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length === 9 ? allPages.length : undefined,
    enabled: !!currentUser?.user?.isAdmin, // Ensure this is a boolean
  });

  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      setPosts(allPosts);
    }
  }, [data]);

  const handleDeletePost = async () => {
    if (!selectedPostId) return;
  
    const token = localStorage.getItem("access_token");
  
    try {
      const res = await fetch(
        `https://paul-s-blog.onrender.com/api/post/delete-post/${selectedPostId}/${currentUser.user._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Failed to delete post:", data.message);
        return;
      }
  
      // Update UI after successful deletion
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== selectedPostId)
      );
      setSelectedPostId(null);
      setShowModel(false);
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("An error occurred while deleting the post:", error.message);
    }
  };
  


  if (isLoading) {
    return (
      <div className="mx-auto text-xl md:ml-[300px] md:text-2xl">
        Loading posts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto md:ml-[300px] text-xl lg:text-2xl">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="w-full mx-auto px-[12px] md:px-[20px] pb-[50px]">
        <div className="md:ml-[280px] relative mx-auto">
          {currentUser.user.isAdmin && posts.length > 0 ? (
            <>
              <div className="sm:p-[20px] md:mt-[-3px] rounded-[5px] md:shadow-md dark:border md:mx-auto overflow-x-scroll mt-[10px] scrollbar scrollbar-thumb-[gray]">
                <Table className="w-[1000px] static mx-auto table-auto bg-transparent dark:bg-transparent">
                  <Table.Head>
                    <Table.HeadCell className="font-medium" >DATE UPDATED</Table.HeadCell>
                    <Table.HeadCell className="font-medium" >POST IMAGE</Table.HeadCell>
                    <Table.HeadCell className="font-medium" >POST TITLE  </Table.HeadCell>
                    <Table.HeadCell className="font-medium" >CATEGORY</Table.HeadCell>
                    <Table.HeadCell className="font-medium" >DELETE</Table.HeadCell>
                    <Table.HeadCell className="font-medium" >EDIT</Table.HeadCell>
                  </Table.Head>

                  {posts.map((post) => (
                    <Table.Body key={post._id}>
                      <Table.Row>
                        <Table.Cell>
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/post/${post.slug}`}>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="my-[15px] cursor-pointer max-w-[75px] max-h-[75px] rounded-[5px] bg-[gray]"
                            />
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/post/${post.slug}`}>
                            <div className="truncate max-w-[250px] mr-[0px]">
                              {post.title}
                            </div>
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => openModel(post._id)}
                            className="text-red-400 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/edit-post/${post._id}/${currentUser.user._id}`}>Edit</NavLink>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
              {hasNextPage && (
                <div className="flex justify-center items-center">
                  <button
                    className="bg-[blue] px-[20px] my-[30px] py-[7px] rounded-lg text-white hover:bg-[gray] cursor-pointer"
                    onClick={() => fetchNextPage()}
              
                  >
                    {isFetchingNextPage ? "Loading more..." : "Show more"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="m-auto px-[12px] sm:px-[20px] text-xl">
              You have no post yet!
            </div>
          )}

          {showModel && (
            <div className="fixed px-[12px] sm:px-[20px] inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative w-full max-w-[350px] p-6 bg-gray-800 text-white rounded-lg shadow-lg">
                <button
                  onClick={closeModel}
                  className="absolute top-2 right-2 text-white hover:text-gray-400 focus:outline-none"
                >
                  <img className="w-6 h-6" src={close} alt="Close" />
                </button>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Are you sure you want to delete your post?
                  </h3>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={handleDeletePost}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={closeModel}
                      className="px-4 py-2 text-sm font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-200 focus:outline-none"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

}

export default DashPosts;
