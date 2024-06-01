const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, proces.env.SECRET_KEY, (err, user) => {
    console.log(user);
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
