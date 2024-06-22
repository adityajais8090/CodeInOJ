const express = require ('express');
const {DBconnection} = require('./database/db');
const User = require('./models/Users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./middleware/auth.js');
dotenv.config();

const app = express();

//middleware ,we used to get accept our data from frontend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());

//connect to database
DBconnection();
app.get("/", (req,res)=>{
    res.send("Cool, Welcome to the server");
})

// GET /profile endpoint with authentication middleware
app.get("/profile", auth, async (req, res) => {
    try {
        // Assuming auth middleware sets user information in req.user
        const userId = req.user.id; // Assuming id is stored in req.user from auth middleware

        // Optional: Fetch user profile from database (if needed for other operations)
        const user = await User.findById(userId);

        // Respond with a success message upon successful authentication
        res.json({
            message: "Authenticated! Profile Page Access Granted.",
            user: {
                id: user._id, // Optional: Include user ID if needed
                // Add other minimal user details as needed for frontend authentication checks
            }
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).send("Internal Server Error");
    }
});

//http method get
app.get("/home", (req,res)=>{
    res.send("Welcome to the Home");
})

//http method post for register because i have to post data
app.post("/register", async (req,res)=>{
    console.log(req);
    try{
        // get all the data from request body
        //destructure at once from req
        const {firstname, lastname, email, password}  = req.body;
        // check all data is correct & exist
        if(!(firstname && lastname && email && password)){
            return res.status(400).send("Please enter all  the require details")
        }
        //here we have to make a database
        // check if user already exist  
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).send("Email is already exist");
        }

        // encrypt the password
        const hashPassword = bcrypt.hashSync(password, 8);
        console.log(hashPassword);
        // make a user object and save it to database

        const user = await User.create({
           firstname,
           lastname,
           email,
           password : hashPassword
        });
        // generate a token (jwt) for user and send it
        const token = jwt.sign({id : user._id, email},process.env.SECRET_KEY,{
            expiresIn : "1h"
        });

        // append token in user
        user.token = token;
        await user.save();
        user.password = undefined;

        res.status(201).json({
            message : "YOU have successfully registerd !",
            user
        });

    }catch(err){
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
});


app.post("/login", async (req, res) => {
    try {
        // Get all data from request body
        const { email, password } = req.body;

        // Check that all data should exist
        if (!(email && password)) {
            return res.status(400).send("Please enter all required details");
        }

        // Find the user in database
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(400).send("Return to Register Page");
        }

        // Decrypt password
        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(400).send("Invalid Credentials!");
        }

        // Generate token
        const token = jwt.sign({ id: existUser._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });

        existUser.token = token;
        existUser.save();

        existUser.password = undefined;

        // Store it in cookie
        const options = {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true, 
            //secure: process.env.NODE_ENV === 'production' // Ensure the cookie is sent over HTTPS in production
        };
        
        // Send the token
        res.status(200).cookie("token", token, options).json({
            message: "Login Successfully!",
            success : true,
            existUser
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Login Error");
    }
});


app.post('/logout', (req,res)=>{
  console.log(req);
  try{
    //get token from cookie
    let token = req.cookies.token;
    if(!token) return res.status(400).send("no cookie provided");
    //decode jwt token
    let decodedUser = jwt.verify(token, process.env.SECRET_KEY);
    if(!decodedUser || !decodedUser.id) return res.status(400).send("no user exist");
    //find existing user
    let existingUser = User.findById(decodedUser.id);
    if(!existingUser) return res.status(400).send("User not found");

    //delete token
    let options = {
        httpOnly : true,
    }
    res.status(500).clearCookie("token",token, options).json({
        message : "LOGOUT Successfully!",
        success : true,
        decodedUser,
    })
  }catch(err){
    console.error("error in deleting profile" + err);
    res.status(500).send("INTERNAL SERVER ERROR");
  }
})

app.listen(8000, ()=>{
    console.log("Server is listening in port : 8000");
});