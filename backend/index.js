import express from 'express';
import DBconnection from './database/db.js';
import {User, Problem, TestCases, Contest } from './models/index.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import  cors from 'cors';
import { auth , authAdmin } from './middleware/index.js';
dotenv.config();

const app = express();

//middleware ,we used to get accept our data from frontend
app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend domain
    credentials: true // Allow credentials (cookies)
}));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser(process.env.SECRET_KEY));

//connect to database
DBconnection();


//http method get
app.get("/", (req,res)=>{
    res.send("Welcome to the Home");
})



//http method post for register because i have to post data
app.post("/register", async (req,res)=>{
    console.log(req);
    try{
        // get all the data from request body
        //destructure at once from req
        const {firstname, lastname, email, password, role}  = req.body;
        // check all data is correct & exist
        if(!(firstname && lastname && email && password && role)){
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
           password : hashPassword,
           role,
        });
        // generate a token (jwt) for user and send it
        const token = jwt.sign({id : user._id, email, role},process.env.SECRET_KEY,{
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
            sameSite : 'none',
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

app.delete('/logout', auth, (req, res) => {
    try {
      res.clearCookie('token').json({
        message: 'Logout Successfully!',
        success: true,
      });
    } catch (err) {
      console.log('Failed to logout:', err);
      res.status(500).json({
        message: 'Server Error',
        success: false,
      });
    }
  });

  app.get("/profile", auth, async (req, res) => {
    try {
      const token = req.cookies.token; // Corrected token extraction
  
      if (!token) {
        return res.status(401).json({
          message: "No token provided",
          success: false,
        });
      }
  
      // Fetch the user using the token
      const existUser = await User.findOne({ token });
  
      // Send the profile data as JSON response
      res.status(200).json({
        success: true,
        status: 200,
        existUser,
      });
    } catch (err) {
      // Handle errors
      console.error("Error fetching profile:", err);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  });
  

app.get("/admin", authAdmin , (req,res) => {
    try{
        res.json({
            message : "Welcome to admin page",
            success : true,
        })

    }catch(error){
        console.log("Invalid Credentials Login again : ", err );
    }
    
})  
  

app.post("/profile/add", authAdmin , async(req,res)=>{
    try{
        console.log(req.body);
         // get problem and test cases
        const {title, description, constraints, tags, input1 , output1, input2, output2} = req.body;
        //check all data should be correct and exist
        if(!(title && description && constraints && tags && input1 && output1 && input2 && output2)){
            return res.status(400).send("Complete all the details");
        }
        //check that problem should be unique
        const existingProblem = await Problem.findOne({title});
        if(existingProblem){
            return res.status(500).send("Problem already exist!");
        }
        // Find the current maximum code
        const maxProblem = await Problem.findOne().sort({ code: -1 });
        const code = maxProblem ? maxProblem.code + 1 : 1;

        //store it in database
        const problem = await Problem.create({
          title,
          description,
          constraints,
          tags,
          code,
        });
       // store the sample test cases
        const testcases1 = await TestCases.create({
            input : input1,
            output : output1,
            problemtitle : title,
            code,
            problemId : problem.id,
        });
        const testcases2 = await TestCases.create({
            input : input2,
            output : output2,
            problemtitle : title,
            code,
            problemId : problem.id,
        });

        problem.testcaseId = [testcases1._id, testcases2._id];
        await problem.save();
       
        console.log("Here is my problemId : ", problem.id );

        res.status(201).json({
            message : "Problem Added Successfully !",
            problem,
            testcases1,
            testcases2,
        });

    }catch(err){
        console.log("Error in adding Problem : " , err);
        return res.status(400).send("Not able to add problem");
    }
})

app.post("/profile/add/testcases", async(req, res) => {
  const { inputTestcases, outputTestcases, code } = req.body;
  if (!(inputTestcases && outputTestcases && code)) {
      return res.status(404).json({
          message: "Fill all the details",
          success: false,
      });
  }
  const existProblem = await Problem.findOne({code});
  const existTestcases = await TestCases.findOne({ code });
  if (!(existTestcases && existProblem)) {
      return res.status(404).json({
          message: "Sample TestCases do not exist",
          success: false,
      });
  }

  function extractTestCases(existTestcases, inputTestcases, outputTestcases) {
      // Determine the number of lines per test case from the existing test cases
      let linesPerTestCaseInput = existTestcases.input.split('\n').length;
      let linesPerTestCaseOutput = existTestcases.output.split('\n').length;

      // Split the input and output strings into lines
      let inputLines = inputTestcases.trim().split('\n');
      let outputLines = outputTestcases.trim().split('\n');

      // Check if input and output test cases are in the correct proportion
      if (inputLines.length % linesPerTestCaseInput !== 0 || outputLines.length % linesPerTestCaseOutput !== 0) {
          throw new Error("Input and output test cases are not in the correct proportion as defined by existTestcases.");
      }

      // Extract input and output test cases based on the detected number of lines
      let inputTestCases = [];
      for (let i = 0; i < inputLines.length; i += linesPerTestCaseInput) {
          let inputTestCase = inputLines.slice(i, i + linesPerTestCaseInput).join('\n');
          inputTestCases.push(inputTestCase);
      }

      let outputTestCases = [];
      for (let i = 0; i < outputLines.length; i += linesPerTestCaseOutput) {
          let outputTestCase = outputLines.slice(i, i + linesPerTestCaseOutput).join('\n');
          outputTestCases.push(outputTestCase);
      }

      return { inputTestCases, outputTestCases };
  }

  try {
      const { inputTestCases, outputTestCases } = extractTestCases(existTestcases, inputTestcases, outputTestcases);

      // Store the extracted test cases in the database
      for (let i = 0; i < inputTestCases.length; i++) {
          let newTestCase = new TestCases({
              input: inputTestCases[i],
              output: outputTestCases[i],
              code: code,
              problemtitle : existProblem.title,
              problemId : existProblem._id,
          });
          console.log("Here is my testcases :", newTestCase);
          await newTestCase.save();
      }

      return res.status(200).json({
          message: "Test cases added successfully",
          success: true,
      });
  } catch (error) {
      return res.status(400).json({
          message: error.message,
          success: false,
      });
  }
});


app.post("/problem/edit", authAdmin, async (req, res) => {
    console.log(req.body);
    const { code, title, description, constraints, tags, input1, output1, input2, output2 } = req.body;
    console.log("Code: ", code);

    // Check all the details are present
    if (!(title && description && constraints && tags && input1 && output1 && input2 && output2 && code)) {
        return res.status(400).send("Complete all problem details");
    }

    try {
        // Log the incoming request details
        console.log("Received request to edit problem:", req.body);

        // Find existing problem and test cases
        const existProblem = await Problem.findOne({ code });
        const testcase1 = await TestCases.findById(existProblem.testcaseId[0]);
        const testcase2 = await TestCases.findById(existProblem.testcaseId[1]);

        if (!(existProblem && testcase1 && testcase2)) {
            console.log("Problem or test cases not found for code:", code);
            return res.status(404).send("Problem not found");
        }

        const problemId = existProblem._id;
        const problemtitle = title;

        // Update the test cases
        await TestCases.updateOne(
            { _id: existProblem.testcaseId[0] },
            {
                $set: { input: input1, output: output1, problemtitle, problemId }
            }
        );

        await TestCases.updateOne(
            { _id: existProblem.testcaseId[1] },
            {
                $set: { input: input2, output: output2, problemtitle, problemId }
            }
        );

        // Update the problem
        await Problem.updateOne(
            { code },
            {
                $set: { title, description, constraints, tags }
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


app.get('/problemset', async (req, res) => {
    try {
        const problems = await Problem.find();
       //console.log("here is  your Problems : " , problems);
        res.json(problems);
    } catch (err) {
        res.json(err);
    }
});


app.get("/problemset/problem", async (req, res) => {
    // Get the data from request
    const { id } = req.query;
  
    // Check if all data is present
    if (!id) {
      return res.status(400).send("Complete all details");  // Status 400 for Bad Request
    }
  
    try {
      // Check it in database problem and test cases
      const existProblem = await Problem.findOne({ _id: id });

      console.log("Problem from backend : ", existProblem);
  
      if (!existProblem) {
        return res.status(404).send("Problem not found");  // Status 404 for Not Found
      }
  
      // Send response
      return res.status(200).json({
        message: "Get Problem Successfully!",
        existProblem,
      });
    } catch (error) {
      console.error("Error fetching problem:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  

  app.get("/problemset/problem/testcases", async (req, res) => {
    // Get the data from request
    const { code } = req.query;
  
    // Check if all data is present
    if (!code) {
      return res.status(400).json({
        message: "Complete all details",  // Status 400 for Bad Request
        success: false,
      });
    }
  
    try {
      // Check in the database for test cases
     const existProblem = await Problem.findOne({code});
     const existTestcase = await TestCases.find({code});
  
      if (!(existProblem && existTestcase)) {
        return res.status(404).json({
          message: "Problem or TestCase not found",  // Status 404 for Not Found
          success: false,
        });
      }
      const testcases1 = await TestCases.findById(existProblem.testcaseId[0]);
      const testcases2 = await TestCases.findById(existProblem.testcaseId[1]);

      if(!(testcases1 && testcases2)){
        return res.status(404).json({
            message : "testcase not found",
            success : false,
        })
      }
  
      // Send response with 2 test cases
      return res.status(200).json({
        message: "Get TestCases Successfully!",
        success: true,
        testcases: [testcases1, testcases2],
        existTestcase, // Return the first 2 test cases
        existProblem,
      });
    } catch (error) {
      console.error("Error fetching test cases:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
});

  

app.delete("/problemset/problem/delete", authAdmin, async (req, res) => {
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

app.post("/submit", auth, async (req, res) => {
    const { problemId, code, status } = req.body;

    // Check if problemId and status are provided
    if (!(problemId && status && code)) {
        return res.status(404).json({
            message: "Send all the data",
            success: false,
        });
    }

    // Extract token from cookies
    const token = req.cookies.token;
    try {
        // Update the submissions array
        await User.updateOne(
            { token },
            {
                $push: { submissions: { problemId, code, status } },
            }
        );

        res.status(200).json({
            message: "Submission updated successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
});

app.post("/create/contest", authAdmin, async (req, res) => {
    const { title, contestCode, startTime, endTime, duration } = req.body;
    
    if (!(title && contestCode && startTime && endTime && duration)) {
        return res.status(400).json({
            message: "Please fill all required fields",
            success: false,
        });
    }

    try {
          
        const contest = await Contest.create({
            title,
            contestCode,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            duration,
        });

        res.status(201).json({
            message: "Contest created successfully!",
            contest,
            success: true,
        });
    } catch (error) {
        console.log("Error in creating Contest:", error);
        res.status(500).json({
            message: "Failed to create contest",
            error: error.message,
            success: false,
        });
    }
});


app.post("/update/contest", authAdmin, async (req, res) => {
    const { contestCode, problemCode } = req.body;

    if (!(contestCode && problemCode)) {
        return res.status(400).json({
            message: "Both contestCode and problemCode are required",
            success: false,
        });
    }

    try {
        const contest = await Contest.findOne({ contestCode });
        if (!contest) {
            return res.status(404).json({
                message: "Contest not found",
                success: false,
            });
        }

        const problem = await Problem.findOne({ code: problemCode });
        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
                success: false,
            });
        }

        await Contest.updateOne({ contestCode }, { $push: { problemId: problem._id } });
    

        res.status(200).json({
            message: "Contest updated successfully",
            contest,
            success: true,
        });
    } catch (error) {
        console.error("Error in updating Contest:", error);
        res.status(500).json({
            message: "Failed to update contest",
            error: error.message,
            success: false,
        });
    }
});




app.get("/contests/contest", auth, async (req, res) => {
    try {
        const getContest = await Contest.find();
        return res.status(200).json({
            message: "get all contest",
            data : getContest,
            success: true,
        });
    } catch (error) {
        console.error("Error in finding contest:", error);
        return res.status(500).json({
            message: "Error in finding contest",
            error: error.message,
            success: false,
        });
    }
});




app.listen(8000, ()=>{
    console.log("Server is listening in port : 8000");
});
