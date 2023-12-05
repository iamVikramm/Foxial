const User = require("../models/user")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
require("dotenv").config()


// SIGNUP
const userSignup = async function(req,res){
    const { email, username, password, confirmPassword } = req.body;

try {
    // Check if any required field is missing
    if (!username || !email || !password || !confirmPassword) {
        throw { status: 400, message: 'All four fields are required.' };
    }

    // Check if the email entered already exists
    const emailExist = await User.findOne({ email }).exec();
    if (emailExist) {
        throw { status: 409, message: 'Email Already Exists' };
    }

    // Check if the username entered already exists
    const temp = username.charAt(0).toUpperCase() + username.slice(1);
    const usernameExist = await User.findOne({ username:temp }).exec();
    if (usernameExist) {
        throw { status: 409, message: 'Username Already Exists' };
    }

    // Check if the password is at least 8 characters
    if (password.length < 8) {
        throw { status: 400, message: 'Password must be at least 8 characters' };
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        throw { status: 400, message: 'Password and Confirm Password do not match' };
    }

    // All checks passed, proceed with user registration logic here
        // Creating the user
        else {

    
            const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
             // Hash password
            const hashedpw = await bcrypt.hash(password,10)
            
            const newUser = new User({
                email:req.body.email,
                password:hashedpw,
                username:formattedUsername,
                friendships:[],
                avatar:"/uploads/users/avatar"+"/profile_pic.jpg"
            })
            try {
                const user = await newUser.save();
                const {password:pass,_id:_id,...rest} = user._doc
                res.json(rest)
            } catch (error) {
                res.status(401).send({
                    message:"Internal Error",
                })
            } 
        }

} catch (error) {
    // Handle errors
    return res.status(error.status || 500).send({ message: error.message || 'Internal Server Error' });
}

}


// LOGIN
const userLogin = async function(req,res){
    const{email,password} = req.body;
    const user = await User.findOne({email})
    
    if(user){
        const userID = user._id;
        // Decrypting password
        const bcPassword = await bcrypt.compare(password, user.password)
        
        try {
            // Checking both email and password
            if(!user || !bcPassword){
                return res.status(400).send({
                    message:"Invalid Username or Password"
                })
            }else{
                const token = await JWT.sign({
                    userID
                },process.env.JWT_SECRET_KEY,{expiresIn:600000*60*24})
                res.json({
                    authToken:{token:token,duration:"1m"}
                })
            }
            
        } catch (error) {
            res.send(error)
        }
    }else{
        return res.status(400).send({
            message:"User do not exist"
        })
    }

}
// Exporting Controllers
module.exports = {
    userSignup,
    userLogin
}