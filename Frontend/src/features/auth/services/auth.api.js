// Write the logic of how does the frontend interact with the backend API
import axios from "axios"//its use to make the HTTP request to the backend API

export async function register({username, email, password}){

    try{
        const response = await axios.post("http://localhost:3000/api/auth/register", {
            username, email, password
        },{
            //as the frontend and the backend uses the diff ports so use axios cross-origin Axios requests.
            withCredentials: true
        })
        return response.data
    }catch(err){
        console.log(err)
    }

}
export async function login({email, password}){
    try{
        const response = await axios.post("http://localhost:3000/api/auth/login", {
            email, password
        }, {
            withCredentials: true
        })
        return response.data
    }catch(err){
        console.log(err)
        throw err
    }
}
export async function logout(){
    try{
        const response = await axios.get("http://localhost:3000/api/auth/logout", {
            withCredentials: true
        })
        return response.data
    }catch(err){
        console.log(err)
        throw err
    }
}
export async function getMe(){ 
    try{
        const response = await axios.get("http://localhost:3000/api/auth/get-me", {
            withCredentials: true 
        })
        return response.data
    }catch(err){
        console.log(err)
        throw err
    }
}