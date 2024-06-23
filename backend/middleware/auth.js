const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const auth = async (req, res, next) => {
    try {
        console.log(req);
        // Access token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Authorization failed: No token provided' });
        }
        //console.log(token);

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user object from decoded token to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Proceed to next middleware or route
        next();

    } catch (err) {
        console.error('Error in auth middleware:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = auth;
