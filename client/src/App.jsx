import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ThemeProvider from "./components/ThemeProvider.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"

const App = () => {

  
  return (
    <>
      <BrowserRouter>
         <Header />  {/* This header component will be at the top of every page*/}
         <ThemeProvider>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/sign-in" element={ <SignIn /> } />
          <Route path="/sign-up" element={ <SignUp /> } />
          <Route element={<PrivateRoute />}> 
          <Route path="/dashboard" element={ <Dashboard /> } />
          </Route>  
          <Route path="/projects" element={ <Projects /> } />
        </Routes>
        </ThemeProvider>
        <Footer /> {/* This footer component will be at the bottom of every page */}
 
      </BrowserRouter>
    </>
  )
}

export default App
