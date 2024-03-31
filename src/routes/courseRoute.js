const express = require('express');
const courseController = require('../controllers/courseController');

let route = express.Router();

route.get('/all', courseController.getAll);
route.get('/detail', courseController.getDetail);
route.post('/post', courseController.post);
route.get('/teaching', courseController.teaching);

module.exports = route;
