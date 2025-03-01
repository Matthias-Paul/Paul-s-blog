import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

const PrivateRouteForAdmin = () => {
    const { currentUser } =  useSelector((state) => state.user)
    return currentUser && currentUser.user.isAdmin ? <Outlet/> : <Navigate to="/sign-in" />
   
}

export default PrivateRouteForAdmin;
