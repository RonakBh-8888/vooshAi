const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ResponseService = require('../services/responce')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return new ResponseService(req, res).unAuthorizedError({error: 'Access denied'});
    } else {
        const [type, token] = authHeader.split(' ');
        const user = await User.findOne({token});
        if (type !== 'token' || !user) {
            return new ResponseService(req, res).unAuthorizedError({error: 'Access denied'});
        } else {
            req.currentUser = user;
            return next();
        }
    }

  } catch (error) {
     next(error)
  }
};

module.exports = authMiddleware;
