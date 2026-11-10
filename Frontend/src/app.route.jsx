import { createBrowserRouter } from "react-router-dom"
import Login from "./features/auth/pages/Login.jsx"
import Register from "./features/auth/pages/Register.jsx"
import Protected from "./features/auth/components/Protected.jsx"
import Home from "./features/interview/pages/home"
import Interview from "./features/interview/pages/interview"

export const router = createBrowserRouter([
    {   
     //user visits the "/" URL, React Router renders </> component 
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/",
        element: <Protected> <Home/> </Protected>//protect the home page so without login no can access
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview/></Protected>
    }
])
