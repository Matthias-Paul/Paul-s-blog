import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice.js";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const googlePhotoURL = resultsFromGoogle.user.photoURL;

      // Send user details to the backend
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoURL: googlePhotoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token from the backend
        localStorage.setItem("access_token", data.token);

        // Update Redux state with user data
        dispatch(signInSuccess(data));
        navigate("/");

        console.log("User Data from Backend:", data);
      } else {
        console.error("Backend Error:", data.message);
      }
    } catch (err) {
      console.error("Error during Google Sign-In:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        type="button"
        className="w-full md:w-[370px] p-[9px] m-auto font-[500] hover:bg-[gray] bg-[blue] text-white text-lg rounded-lg mt-[20px] cursor-pointer"
      >
        <AiFillGoogleCircle className="w-7 h-7 inline" />
        <span> Continue with Google </span>
      </button>
    </div>
  );
};

export default OAuth;
