const express = require('express');
const chapterController = require('../controllers/chapterController');

let route = express.Router();

route.post('/post', chapterController.post);

module.exports = route;
