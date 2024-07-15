import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import dotenv from 'dotenv';

dotenv.config();

export const auth = async (req, res, next) => {
    try {
        
        // Access token from cookie
        const token = req.cookies.token;

        //console.log("Auth Token :", req.cookies.token);
       

        if (!token) {
            return res.status(404).json({ 
                message: 'Authorization failed: No token provided',
                success : false });
        }
        //console.log(token);

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user object from decoded token to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ 
                message: 'User not found',
                 success : false, });
        }

        // Proceed to next middleware or route
        next();

    } catch (err) {
        console.error('Error in auth middleware:', err.message);
        res.status(500).json({ 
            message: 'Server Error',
            success : false, });
    }
};

export const authAdmin = async (req, res, next) => {
    try {
        
        // Access token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(404).json({ 
                message: 'Authorization failed: No token provided',
            success : false, });
        }
        //console.log(token);

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user object from decoded token to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user || req.user.role === "user") {
            return res.status(404).json({ 
                message: 'User not found',
                success : false, });
        }

        // Proceed to next middleware or route
        next();

    } catch (err) {
        console.error('Error in auth middleware:', err.message);
        res.status(500).json({ 
            message: 'Server Error',
            success : false, });
    }
};


