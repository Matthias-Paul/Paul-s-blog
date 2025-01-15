import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import image from "../assets/download.png";
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice.js";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(currentUser.profilePicture || "");
  const [isUploading, setIsUploading] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

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
          setProfileImageURL(result.secure_url);
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

    const token = localStorage.getItem("access_token"); // Correct method for token retrieval

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
      dispatch(updateStart());

      const res = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Update failed:", data.message);
        dispatch(updateFailure(data.message || "An error occurred"));
        return;
      }

      dispatch(updateSuccess(data));
      console.log("User updated successfully:", data);
    } catch (error) {
      console.error("An error occurred while updating user:", error);
      dispatch(updateFailure(error.message || "An unexpected error occurred"));
    }
  };

  return (
    <div>
      <div className="text-center flex flex-col items-center">
        <h1 className="font-[500] text-[30px] md:text-[40px] py-[20px]">Profile</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleProfileImage}
            ref={filePickerRef}
          />
          <div className="flex justify-center pb-[20px]">
            <img
              onClick={() => filePickerRef.current.click()}
              className="w-[120px] h-[120px] md:w-[160px] cursor-pointer md:h-[160px] object-cover rounded-full border-8"
              src={profileImageURL || image}
              alt="Profile"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              value={username}
              className="w-[320px] text-black sm:w-[370px] rounded-lg border border-gray-300 mt-[6px]"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
              className="w-[320px] sm:w-[370px] text-black rounded-lg border border-gray-300 mt-[6px]"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-[320px] sm:w-[370px] text-black rounded-lg border border-gray-300 mt-[6px]"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-[370px] p-[10px] text-lg rounded-lg font-[500] text-white mt-[30px] cursor-pointer bg-[blue] hover:bg-[gray]"
          >
            Update
          </button>
        </form>
      </div>
      <div className="text-red-500 flex justify-between mt-[12px] mb-[25px] text-[15px]">
        <div className="cursor-pointer">Delete Account</div>
        <div className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
};

export default DashProfile;
