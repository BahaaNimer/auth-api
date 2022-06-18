'use strict';
const express = require('express');

const { Clothes } = require('../models/index.model');

const clothesRouter = express.Router();

//add routes here
clothesRouter.get('/clothes', getClothes);
clothesRouter.get('/clothes/:id', getOneClothe);
clothesRouter.post('/clothes', addClothe);
clothesRouter.put('/clothes/:id', updateClothe);
clothesRouter.delete('/clothes/:id', deleteClothe);

//add callback functions here
async function getClothes(req, res) {
  let clothes = await Clothes.read();
  res.status(200).json(clothes);
}
async function getOneClothe(req, res) {
  let clotheId = parseInt(req.params.id);
  let clothe = await Clothes.read(clotheId);
  res.status(200).json(clothe);
}
async function addClothe(req, res) {
  let newClothe = req.body;
  let clothe = await Clothes.create(newClothe);
  res.status(201).json(clothe);
}
async function updateClothe(req, res) {
  let clotheId = parseInt(req.params.id);
  let updateClothe = req.body;
  let foundClothe = await Clothes.read(clotheId);
  if (foundClothe) {
    let updatedClothe = await Clothes.update(updateClothe);
    res.status(201).json(updatedClothe);
  } else {
    res.status(404).json({ message: 'Clothe not found' });
  }
}
async function deleteClothe(req, res) {
  let clotheId = parseInt(req.params.id);
  let foundClothe = await Clothes.read(clotheId);
  if (foundClothe) {
    let deletedClothe = await Clothes.delete(clotheId);
    res.status(204).json(deletedClothe);
  } else {
    res.status(404).json({ message: 'Clothe not found' });
  }
}

module.exports = clothesRouter;