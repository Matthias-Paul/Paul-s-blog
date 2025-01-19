import { useSelector, useDispatch } from "react-redux"
import { toggleUserExit } from "../redux/user/userSlice.js";

const ThemeProvider = ({children}) => {
    const { theme } = useSelector((state) => state.theme)

    const dispatch = useDispatch();

    const exitProfilePopup = () => {
      dispatch(toggleUserExit());
    };
  
    return (
      <>
        <div onClick={exitProfilePopup} className={theme}>
            <div className="bg-white text-black dark:text-white dark:bg-black min-h-screen ">
            {children}
            </div>
        
        </div>
      </>
    )
  }
  
  export default ThemeProvider
  