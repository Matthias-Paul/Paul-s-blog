import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { NavLink } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);

  // Define the fetchPosts function
  const fetchPosts = async () => {
    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/post/get-post?userId=${currentUser.user._id}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  };

  // Use React Query to fetch posts
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", currentUser.user._id],
    queryFn: fetchPosts,
    enabled: currentUser.user.isAdmin, // Only fetch if the user is an admin
  });

  const posts = data?.posts || [];
  const showMore = posts.length >= 9;

  if (isLoading) {
    return <div className=" mx-auto  text-xl md:text-2xl" >Loading posts...</div>;
  }

  if (isError) {
    return <div className=" mx-auto text-xl md:text-2xl " >Failed to load posts. Please try again later.</div>;
  }

  return (
    <>
      <div className="w-full mx-auto pb-[50px]">
        <div className="md:ml-[280px] px-[12px] md:px-[20px]  mx-auto">
          {currentUser.user.isAdmin && posts.length > 0 ? (
            <>
              <div className="sm:p-[20px] md:mt-[-3px] rounded-[5px] md:shadow-md dark:border md:mx-auto overflow-x-scroll mt-[10px] scrollbar scrollbar-thumb-[gray]">
                <Table className="w-[1000px] static mx-auto table-auto bg-transparent  dark:bg-transparent">
                  <Table.Head>
                    <Table.HeadCell>
                      <div>Date Updated</div>
                    </Table.HeadCell>
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
                          <div>{new Date(post.updatedAt).toLocaleDateString()}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/post/${post.slug}`}>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="my-[15px] cursor-pointer max-w-[75px] rounded-[5px] bg-[gray]"
                            />
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell >
                          <NavLink to={`/post/${post.slug}`}>
                          <div className=" truncate max-w-[250px] mr-[0px] "> {post.title} </div>
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                        <Table.Cell>
                          <span className="text-red-400 hover:underline cursor-pointer">Delete</span>
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/edit-post/${post._id}`}>Edit</NavLink>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
              {showMore && (
                <div className="flex justify-center items-center">
                  <button className="bg-[blue] px-[20px] my-[30px] py-[7px] rounded-lg text-white hover:bg-[gray] cursor-pointer">
                    Show more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="m-auto px-[12px] sm:px-[20px] text-xl">You have no post yet!</div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashPosts;
