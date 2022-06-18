'use strict';

const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

const { Users } = require('../models/index.model');
const basicAuth = require('../middleware/basic');
const bearerAuth = require('../middleware/bearer');
const permissions = require('../middleware/acl');

authRouter.post('/signup', async (req, res) => {
  try {
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, 10);
    let role = req.body.role;
    const record = await Users.create({
      username: username,
      password: password,
      role: role
    });
    res.status(201).json(record);
  } catch (error) {
    res.send('sign up failed');
  }
});

authRouter.post('/signin', basicAuth, async (req, res) => {
  res.status(200).json(req.user);
});

authRouter.get('/secret', bearerAuth, async (req, res) => {
  res.json({
    'message': 'Success! You can not see this without a token',
    'user': req.user
  })
});

authRouter.get('/users', bearerAuth, permissions('read'), async (req, res) => {
  res.send('You can see this so you can read');
});
authRouter.post('/users', bearerAuth, permissions('create'), async (req, res) => {
  res.send('You can see this so you can create');
});
authRouter.put('/users', bearerAuth, permissions('update'), async (req, res) => {
  res.send('You can see this so you can update');
});
authRouter.delete('/users', bearerAuth, permissions('delete'), async (req, res) => {
  res.send('You can see this because you are an admin');
});

module.exports = authRouter;