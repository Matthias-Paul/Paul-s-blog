import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PrivateRouteForAdmin from "./components/PrivateRouteForAdmin.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import CreatePost from "./pages/CreatePost";
import UpdatePosts from "./pages/UpdatePosts";
import PostPage from "./pages/PostPage";


const App = () => {

  return (
    <>
      <BrowserRouter>
      <ScrollToTop  />
        <Header /> {/* Header is displayed at the top of every page */}
       
        <ThemeProvider>
        
           <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              {/* PrivateRoute will wrap restricted routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<PrivateRouteForAdmin/>} >
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-post/:postId/:userId" element={<UpdatePosts />} />
              </Route>
              <Route path="/projects" element={<Projects />} />
              <Route path="/post/:postSlug" element={<PostPage />} />

            </Routes>
    
        </ThemeProvider>
      
        <Footer /> {/* Footer is displayed at the bottom of every page */}
      </BrowserRouter>
    </>
  );
};

export default App;
