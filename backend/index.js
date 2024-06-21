const express = require ('express');
const {DBconnection} = require('./database/db');
const User = require('./models/Users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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
            return res.status(400).send('./register');
        }

        // encrypt the password
        const hashPassword = bcrypt.hashSync(password, 8);
        console.log(hashPassword);
        // make a user object and save it to database

        const user = await User.create({
           firstname,
           lastname,
           email,
           password : hashPassword,
        });
        // generate a token (jwt) for user and send it
        const token = jwt.sign({id : user._id, email},process.env.SECRET_KEY,{
            expiresIn : "1h"
        });

        // append token in user
        user.token = token;
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


app.post("/login", async (req,res)=>{
    try{
        //get all data from request body
        const { email, password } = req.body;
        //check that all data should exist
        if(!(email && password)){
           return res.status(400).send("Please enter all require details");
        }
        //find the user in database
        const existUser = await User.findOne({email});
        if(!existUser){
            return res.status(400).send("Return to Register Page");
        }
        //decrypt password
        const isMatch = await bcrypt.compare(password, existUser.password);
        if(!isMatch){
            return res.status(400).send("Invalid Credentials!");
        }
          // generate token
        const token = jwt.sign({id : email,password},process.env.SECRET_KEY, {
            expiresIn : "1h"
            } );
            //store it in cookie
            res.cookie('user_cook', token, {
                expiresIn : "1h",
                httpOnly : true
            })
            //send the token
            res.status(200).json({
                message : "Login Successfully!",
                token
            })
            
    }catch(err){
        console.log(err);
        res.status(500).send("Login Error");

    }
})

app.listen(8000, ()=>{
    console.log("Server is listening in port : 8000");
});
