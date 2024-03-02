import { createBrowserRouter } from "react-router-dom"
import ChooseApp from "../components/choose-app-component/choose-app-component"


const router=createBrowserRouter([
    {path:"/", element:<ChooseApp/> },
])




export default router;