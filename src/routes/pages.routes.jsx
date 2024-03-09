import { createBrowserRouter } from "react-router-dom"
import ChooseApp from "../pages/choose-app-page"
import LearningSession from "../pages/learning-session-page";
import GenericErrorPage from "../pages/errors/generic-error-page";

const router=createBrowserRouter([
    {path:"/", element:<ChooseApp/>, children:[
        {path:"/learning/:subject", element:<LearningSession/>},
        {path:"/error", element:<GenericErrorPage/>},
    ], errorElement:<GenericErrorPage/> },
])




export default router;