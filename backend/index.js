import express from 'express';
import DBconnection from './database/db.js';
import {User, Problem, TestCases } from './models/index.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import  cors from 'cors';
//import { auth } from './middleware/auth.js';
dotenv.config();

const app = express();

//middleware ,we used to get accept our data from frontend
app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend domain
    credentials: true // Allow credentials (cookies)
}));
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

app.get("/profile" , (req,res) => {
    res.send("Welcome to the Profile Page");
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
        await User.updateOne({ email }, { $set: { token } });
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
       // update token in database after login
        await User.updateOne({ email }, { $set: { token } });

       
        existUser.password = undefined;

        // Store it in cookie
        const options = {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true, 
            secure : true,
            sameSite : "None",
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

app.post("/profile/add", async(req,res)=>{
    try{
        console.log(req.body);
         // get problem and test cases
        const {title, description, tags, input , output} = req.body;
        //check all data should be correct and exist
        if(!(title && description && tags && input && output)){
            return res.status(500).send("Complete all the details");
        }
        //check that problem should be unique
        const existingProblem = await Problem.findOne({title});
        if(existingProblem){
            return res.status(500).send("Problem already exist!");
        }
        // Find the current maximum code
        const maxProblem = await Problem.findOne().sort({ code: -1 });
        const code = maxProblem ? maxProblem.code + 1 : 1;
        
        const problemtitle = title;
        //store it in database
        const problem = await Problem.create({
          title,
          description,
          tags,
          code,
        });

        const testcases = await TestCases.create({
            input,
            output,
            problemtitle,
            code,
        });

        res.status(201).json({
            message : "Problem Added Successfully !",
            problem,
            testcases,
        });


    }catch(err){
        console.log("Error in adding Problem : " , err);
        return res.status(400).send("Not able to add problem");
    }
})

app.post("/problem/edit", async (req, res) => {
    const { title, description, tags, input, output, code } = req.body;

    // Check all the details
    if (!(title && description && tags && input && output && code)) {
        return res.status(400).send("Complete all problem details");
    }

    try {
        // Log the incoming request details
        console.log("Received request to edit problem:", req.body);

        // Find existing problem and test cases
        const existProblem = await Problem.findOne({ code });
        const existTestcases = await TestCases.findOne({ code });

        if (!existProblem || !existTestcases) {
            console.log("Problem or test cases not found for code:", code);
            return res.status(404).send("Problem not found");
        }

        const problemId = existProblem._id;
        const testcaseId = existTestcases._id;
        const problemtitle = title;

        // Update the problem
        await Problem.updateOne(
            { code },
            {
                $set: { title, description, tags, testcaseId }
            }
        );

        // Update the test cases
        await TestCases.updateOne(
            { code },
            {
                $set: { input, output, problemtitle, problemId }
            }
        );

        // Return response
        return res.status(200).json({
            message: "Problem updated successfully"
        });
    } catch (err) {
        console.error("Error updating problem:", err);
        return res.status(500).send("Internal Server Error");
    }
});



app.get("/problemset/problem", async ( req, res) => {
    // get the data from request
      const {code, title} = req.body;
      //check all data is present
       if(!(code && title)){
        return res.status(500).send("Complete all details");
       }
      //check it in database problem and test cases
      const existProblem = await Problem.findOne({code});
      const testcases = await TestCases.findOne({code});
      if(!(existProblem && testcases)){
        return res.status(500).send("problem not found");
      }
      //send response
      return res.status(400).json({
        message : "Get Problem Successfully!",
        existProblem,
        testcases,
      })
});

app.delete("/profile/problem/delete", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).send("Please provide a code to delete");
        }

        // Check if problem exists
        const existingProblem = await Problem.findOne({ code });
        if (!existingProblem) {
            return res.status(404).send("Problem not found in database");
        }

        // Delete the problem
        await Problem.deleteOne({ code });

        // Also delete associated test cases
        await TestCases.deleteMany({ code });

        return res.status(200).json({
            message: "Problem and associated test cases deleted successfully"
        });
    } catch (err) {
        console.log("Error deleting problem: ", err);
        return res.status(500).send("Internal Server Error");
    }
});


app.listen(8000, ()=>{
    console.log("Server is listening in port : 8000");
});
