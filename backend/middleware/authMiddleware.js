const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

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

const adminMiddleware = (req, res, next) => {
    if (req.user || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).JSON({
            message: 'Akses ditolak: Khusus Admin!',
        });
    }
};

module.exports = { authMiddleware, adminMiddleware };