
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "paul-blog-1d845.firebaseapp.com",
  projectId: "paul-blog-1d845",
  storageBucket: "paul-blog-1d845.firebasestorage.appspot.com",
  messagingSenderId: "636621771252",
  appId: "1:636621771252:web:dc0e95081daace53e129a1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);