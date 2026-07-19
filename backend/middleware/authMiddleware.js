const jwt = require("jsonwebtoken");
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // check token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(404).json({
                message: "No token provided",
            });
        };

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(toke, process.env.JWT_SECRET);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        };

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;