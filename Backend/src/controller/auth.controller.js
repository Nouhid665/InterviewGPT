const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../model/blacklist.model")

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
};

async function userRegister(req, res){
    //retrive the data from frontend
    const{username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username, email, password"
        })
    }

    //check if username is already taken or not 
    const isUserExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    //if username exists
    if(isUserExists){
        return res.status(400).json({
            message: "Username is already taken"
        })
    }

    //hashed the password than create the user 
    const hash = await bcrypt.hash(password, 10)

    //if user is not exists
    const user = await userModel.create({
        username,
        email,
        password: hash

    })

    //create the token for the user 
    const token = jwt.sign({
        //putting user information inside the token so the backend can identify the user later.
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {expiresIn: "1d"})

    //browser save the token in cookies 
    res.cookie("token", token, cookieOptions)
    res.status(201).json({
        message:"User register successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function userLogin(req, res){
    const{email, password} = req.body
    
    if(!email|| !password){
        return res.status(400).json({
            message: "Username or password is required"
        })
    }
    
    //seach the email in DB
    const user = await userModel.findOne({
        $or:[
            {email}
        ]
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
    // if email is correct than check password
    //check the enter hashed with stored hashed
    const isPasswordValid = await bcrypt.compare(password, user.password)//(body password, DB store password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    //create a new token
    const token = await jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {expiresIn:"1d"})

    //browser save the token in cookies 
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        message:"User login successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })




}

async function userLogout(req, res){
    //fetch the token from cookies 
    const token = req.cookies.token
    
    if(token){
        //blacklist the token 
        await tokenBlacklistModel.create({token})
    }
    
    //clear the cookies
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
})
    res.status(200).json({
        message:"user Logout Successfully"
    })
}
async function getMe(req, res){
    const user = await userModel.findById(req.user.id)//id cz we pass the id in the token while creating it
    return res.status(200).json({
        message:"User details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getMe
}