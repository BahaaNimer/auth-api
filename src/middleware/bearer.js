'use strict';

const { Users } = require('../models/index.model');

module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      req.validUser = await Users.authenticateToken(token);
      req.user = req.validUser;
      next();
    } catch (e) {
      next('Invalid token');
    }
  }
}