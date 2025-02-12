import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import image from "../assets/download.png";
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess,signInSuccess, signOutSuccess } from "../redux/user/userSlice.js";
import close from "../assets/close.svg";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

 console.log(currentUser)
  const [username, setUsername] = useState(currentUser.user.username);
  const [email, setEmail] = useState(currentUser.user.email);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(currentUser.user.profilePicture);
  const [isUploading, setIsUploading] = useState(false);
  const [update, setUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModel, setShowModel] = useState(false);


  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const openModel = () =>{
    setShowModel(true)
  }
  
  const closeModel = () =>{
    setShowModel(false)
  }

  useEffect(() => {
    if (profileImage) {
      const uploadImage = async () => {
        const data = new FormData();
        data.append("file", profileImage);
        data.append("upload_preset", "cloudinary_backend");
        data.append("cloud_name", "drkxtuaeg");
  
        try {
          setIsUploading(true);
          const res = await fetch("https://api.cloudinary.com/v1_1/drkxtuaeg/image/upload", {
            method: "POST",
            body: data,
          });
  
          if (!res.ok) {
            throw new Error("Image upload failed. Please try again.");
          }
  
          const result = await res.json();
          setProfileImageURL(result.secure_url); // Save uploaded image URL
          console.log("Uploaded Image URL:", result.secure_url);
        } catch (error) {
          console.error(error.message);
        } finally {
          setIsUploading(false);
        }
      };
      uploadImage();
    }
  }, [profileImage]);
  

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(false)
    const token = localStorage.getItem("access_token"); 

    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }

    const updatedFormData = {
      username: username.trim(),
      email: email.trim(),
      ...(password && { password }), // Only include password if provided
      ...(profileImageURL && { profilePicture: profileImageURL }), // Include profile picture if available
    };

    try {
      dispatch(updateStart()); // Indicate the update process has started
      setUpdate(null); // Clear previous update messages
      setIsUpdating(true)
      const res = await fetch(`https://paul-s-blog.onrender.com/api/user/update/${currentUser.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
        },
        body: JSON.stringify(updatedFormData), // Send updated user data
      });
    
      const data = await res.json(); // Parse the response JSON
    
      // Check if the response indicates a failure
      if (!res.ok) {
        setIsUpdating(false)
        console.error("Update failed:", data.message);
        
        // Handle specific error messages
        if (data.message) {
          if (data.message.includes("ENOTFOUND") || data.message.includes("Operation")) {
            setIsUpdating(false)
            setUpdate("Update failed. Check your internet connection!");
            
          } else {
            setIsUpdating(false)
            setUpdate(data.message || "An error occurred");
            
          }
        } else {
          setIsUpdating(false)
          setUpdate("An error occurred while updating user.");
        }
    
        setIsUpdating(true)
        dispatch(updateFailure(data.message || "An error occurred"));
        return;
      }
    
      // If the update is successful
      dispatch(updateSuccess(data))
      setIsUpdating(false)
      setUpdate("User Profile Updated Successfully"); // Display success message
      console.log("User updated successfully:", data);
      
    } catch (error) {
      console.error("An error occurred while updating user:", error);
      setIsUpdating(false)
      // Handle unexpected errors
      setUpdate(error.message || "An unexpected error occurred");
      dispatch(updateFailure(error.message || "An unexpected error occurred"));
    }
    
  };



  
  const handleDeleteUser = async () => {
    setShowModel(false);
  
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem("access_token");
  
      const res = await fetch(`https://paul-s-blog.onrender.com/api/user/delete/${currentUser.user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Check if the response has a JSON body
      const data = res.headers.get("Content-Type")?.includes("application/json")
        ? await res.json()
        : { message: "No content returned from the server" };
  
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message || "An error occurred"));
        setUpdate(data.message || "An error occurred");
      } else {
        dispatch(deleteUserSuccess(data));
  
        // Clear user data from localStorage and state
        localStorage.removeItem("access_token");
        dispatch(deleteUserSuccess());
        setUpdate(data.message || "User deleted successfully!");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setUpdate("An error occurred");
      console.error(error.message);
    }
  };
  
  const handleSignout = () => {

    localStorage.removeItem("access_token");
    dispatch(signOutSuccess());
    setUpdate("Sign-out successful!")
    console.log("Sign-out successful! ")

  };
  
  
  return (
    <div>
      <div className="text-center  md:ml-[280px] relative flex flex-col  items-center">
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
                    Are you sure you want to delete this account?
                  </h3>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={handleDeleteUser}
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
        <h1 className="font-[500] text-[30px] md:text-[40px] py-[20px]">Profile</h1>
        <form  onSubmit={handleFormSubmit}>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleProfileImage}
            ref={filePickerRef}
          />
          <div className="flex justify-center  pb-[20px]">
          {
            isUploading? <div className="w-[120px] flex text-[16px] items-center justify-center h-[120px] md:w-[160px] cursor-pointer md:h-[160px]  rounded-full border-8"> Uploading... </div> :  <img
            onClick={() => filePickerRef.current.click()}
            className="w-[120px] h-[120px] md:w-[160px] cursor-pointer md:h-[160px] object-cover rounded-full border-8"
            src={ profileImageURL || image}
            alt="Profile"
          />
          }
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              value={username}
              className="w-[320px] sm:w-[370px]  lg:w-[550px] text-black lg:p-[11px] rounded-lg border border-gray-300 mt-[6px] lg:mt-[16px]"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
              className="w-[320px] sm:w-[370px]  lg:w-[550px] lg:p-[11px] text-black rounded-lg border border-gray-300 mt-[6px] lg:mt-[16px]"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-[320px] sm:w-[370px]  lg:w-[550px] lg:p-[11px] text-black rounded-lg border border-gray-300 mt-[6px] lg:mt-[16px]"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-[370px] p-[10px]  lg:w-[550px] lg:p-[11px] text-lg rounded-lg font-[500] text-white mt-[30px] cursor-pointer bg-[blue] hover:bg-[gray]"
          >
            {isUpdating? "Updating...": "Update"}
          </button>
        </form>
         {
          currentUser.user.isAdmin && (
            <NavLink to="/create-post">
           <button className="w-[320px] sm:w-[370px]  lg:w-[550px] p-[10px]  lg:w-[550px] lg:p-[11px] text-lg rounded-lg font-[500] text-white mt-[12px] bg-[blue] cursor-pointer  hover:bg-[gray]">
              Create a post
          </button>
            </NavLink>  
          )
         }
        
        {update 
        && (
          <div  className="w-[320px] py-[10px] text-[14px]  lg:w-[550px] lg:p-[11px] bg-gray-100 border text-red-400 mt-[15px] w-full md:w-[370px] p-[5px]  rounded-lg font-[500] sm:w-[370px] text-start " > {update} </div>

        )}
        

     
      </div>
      <div className="text-red-500 flex justify-between mt-[12px] mb-[25px] text-[15px]">
        <div onClick={openModel} className="md:ml-[280px] cursor-pointer">Delete Account</div>
        <div onClick={handleSignout} className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
};

export default DashProfile;
