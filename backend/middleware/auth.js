const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const auth = async (req, res, next) => {
    try {
        console.log(req);
        // Access token from cookie
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Authorization failed: No token provided' });
        }

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
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Authorization failed: Invalid token' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = auth;
