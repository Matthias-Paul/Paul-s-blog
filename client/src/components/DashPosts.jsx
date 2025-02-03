import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from "react";
import close from "../assets/close.svg";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [showModel, setShowModel] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const openModel = (postId) => {
    setPostIdToDelete(postId);
    setShowModel(true);
  };

  const closeModel = () => {
    setPostIdToDelete(null);
    setShowModel(false);
  };

  // Define the fetch function for posts
  const fetchPosts = async ({ pageParam = 0 }) => {
    const postsPerPage = 9;
    const startIndex = pageParam * postsPerPage;

    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/post/get-post?userId=${currentUser.user._id}&startIndex=${startIndex}&limit=${postsPerPage}`
    );
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
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
    queryKey: ['posts', currentUser.user._id],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) =>
      lastPage.posts.length === 9 ? lastPage.posts.length / 9 : undefined,
    enabled: !!currentUser?.user?.isAdmin, // Ensure this is a boolean
  });

  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      setPosts(allPosts);
    }
  }, [data]);

  const handleDeletePost = async () => {
    setShowModel(false);
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/post/delete-post/${postIdToDelete}/${currentUser.user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        // Remove the deleted post from the local state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
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
                    <Table.HeadCell>Date Updated</Table.HeadCell>
                    <Table.HeadCell>Post Image</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
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
                          <NavLink to={`/edit-post/${post._id}`}>Edit</NavLink>
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
                    disabled={isFetchingNextPage}
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
            <div className="absolute max-w-[350px] flex flex-col items-end top-[20%] left-[5%] sm:left-[20%] drop-shadow-sm p-[15px] text-white rounded-lg bg-[gray]">
              <div
                onClick={closeModel}
                className="w-[25px] cursor-pointer"
              >
                <img className="w-full" src={close} />
              </div>
              <div className="font-[500] m-auto mt-[35px] px-[20px] text-center text-[18px] max-w-[360px]">
                Are you sure you want to delete your post?
              </div>
              <div className="my-[18px] items-center mx-auto">
                <button
                  onClick={handleDeletePost}
                  className="p-[8px] text-md rounded-lg text-white mt-[13px] cursor-pointer bg-red-700 hover:bg-red-900"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={closeModel}
                  className="p-[8px] ml-[15px] text-md rounded-lg text-black cursor-pointer bg-white"
                >
                  No, cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashPosts;
