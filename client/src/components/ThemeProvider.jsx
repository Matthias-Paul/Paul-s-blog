import { useSelector } from "react-redux"

const ThemeProvider = ({children}) => {
    const { theme } = useSelector((state) => state.theme)
    return (
      <>
        <div className={theme}>
            <div className="bg-black text-white dark:text-black dark:bg-white min-h-screen ">
            {children}
            </div>
        
        </div>
      </>
    )
  }
  
  export default ThemeProvider
  