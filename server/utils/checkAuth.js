import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      req.userId = decoded._id;
      req.role = decoded.role;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired',
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({
          message: 'Invalid token',
        });
      } else {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
    }
  } else {
    return res.status(403).json({
      message: 'Authorization token is required',
    });
  }
};
