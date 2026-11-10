/** in this file we will check that the only the log in user can access some feature 
 * Instead of writing authentication logic in every page, you create one reusable Protected component.
 */
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'

const Protected = ({children}) => {
    const {loading, user} = useAuth() //useAuth returns loading and user

    if(loading){
        return <main><h1>Loading...</h1></main>
    }
    //if its not loading than check==null
    //if user is not login than nagivate it to the login or register page
    if(!user){
        return <Navigate to={'/login'}/>
    }
    return children
}

export default Protected