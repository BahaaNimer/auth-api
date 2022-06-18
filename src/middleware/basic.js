'use strict';

const base64 = require('base-64');
const { Users } = require('../models/index.model');

module.exports = async (req, res, next) => {
  console.log('req.headers.authorization:', req.headers.authorization);
  if (req.headers.authorization) {
    let basicHeaderParts = req.headers.authorization.split(" ");
    let encodedValue = basicHeaderParts.pop();
    let decodedValue = base64.decode(encodedValue);
    let [username, password] = decodedValue.split(":");
    try {
      req.user = await Users.authenticateBasic(username, password)
      next();
    } catch (e) {
      next('Invalid username or password');
    }
  }
}
