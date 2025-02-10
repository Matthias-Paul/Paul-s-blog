import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import close from "../assets/close.svg";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // Store selected user ID

 
  // Define the fetch function for users
  const fetchUsers = async ({ pageParam = 0 }) => {
    const usersPerPage = 9;
    const startIndex = pageParam * usersPerPage;

        const token = localStorage.getItem("access_token");

    const res = await fetch( `https://paul-s-blog.onrender.com/api/user/get-users?startIndex=${startIndex}&limit=${usersPerPage}`,
        {
            
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        }
     );
    if (!res.ok) {
      throw new Error("Failed to fetch users");
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
    queryKey: ["users"],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.users.length === 9 ? allPages.length : undefined,
    enabled: !!currentUser?.user?.isAdmin, // Ensure this is a boolean
  });

  useEffect(() => {
    if (data) {
      const allUsers = data.pages.flatMap((page) => page.users);
      setUsers(allUsers);
    }
  }, [data]);



  if (isLoading) {
    return (
      <div className="mx-auto text-xl md:ml-[300px] md:text-2xl">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto md:ml-[300px] text-xl lg:text-2xl">
        Failed to load users. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="w-full mx-auto px-[12px] md:px-[20px] pb-[50px]">
        <div className="md:ml-[280px] relative mx-auto">
          {currentUser.user.isAdmin && users.length > 0 ? (
            <>
              <div className="sm:p-[20px] md:mt-[-3px] rounded-[5px] md:shadow-md dark:border md:mx-auto overflow-x-scroll mt-[10px] scrollbar scrollbar-thumb-[gray]">
                <Table className="w-[1000px] static mx-auto table-auto bg-transparent dark:bg-transparent">
                  <Table.Head>
                    <Table.HeadCell>Date Created</Table.HeadCell>
                    <Table.HeadCell>User Image</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                    <Table.HeadCell>Admin</Table.HeadCell>
                    <Table.HeadCell>Email Address</Table.HeadCell>
                  
                  </Table.Head>

                  {users.map((user) => (
                    <Table.Body key={user._id}>
                      <Table.Row>
                        <Table.Cell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                         
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="my-[15px]  w-[65px] object-cover h-[65px] rounded-[50%] "
                            />
                   
                        </Table.Cell>
                        <Table.Cell>
                      
                            <div className=" ">
                              {user.username}
                            </div>
                      
                        </Table.Cell>
                        <Table.Cell>{user.isAdmin? "True": "False"}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
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
              You have no user yet!
            </div>
          )}

          
        </div>
      </div>
    </>
  );

}

export default DashUsers;
