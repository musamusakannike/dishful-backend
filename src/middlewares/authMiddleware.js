const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) {
      return sendResponse(res, 401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendResponse(res, 401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error");
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) {
      return sendResponse(res, 401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return sendResponse(res, 403, "Forbidden");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

module.exports = { authenticate, authenticateAdmin };
