'use strict ';

const express = require('express');
const bcrypt = require('bcrypt');

const { Users } = require('../models/index.model');

const userRouter = express.Router();

userRouter.get('/user', getUsers);
userRouter.get('/user/:id', getOneUser);
userRouter.post('/user', addUser);
userRouter.put('/user/:id', updateUser);
userRouter.delete('/user/:id', deleteUser);

async function getUsers(req, res) {
  let users = await Users.findAll();
  res.status(200).json(users);
}
async function getOneUser(req, res) {
  let userId = parseInt(req.params.id);
  let user = await Users.findAll({ where: { id: userId } });
  res.status(200).json(user);
}
async function addUser(req, res) {
  let username = req.body.username;
  let password = await bcrypt.hash(req.body.password, 10);
  let role = req.body.role;
  const user = await Users.create({
    username: username,
    password: password,
    role: role
  });
  res.status(201).json(user);
}
async function updateUser(req, res) {
  let userId = parseInt(req.params.id);
  let updateUser = req.body;
  let foundUser = await Users.findOne({ where: { id: userId } });
  if (foundUser) {
    let updatedUser = await Users.update({ ...updateUser }, { where: { id: userId } });
    res.status(201).json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}
async function deleteUser(req, res) {
  let userId = parseInt(req.params.id);
  let foundUser = await Users.findOne({ where: { id: userId } });
  if (foundUser) {
    let deletedUser = await Users.destroy({ where: { id: userId } });
    res.status(204).json(deletedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}

module.exports = userRouter;