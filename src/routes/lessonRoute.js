const express = require('express');
const lessonController = require('../controllers/lessonController');

let route = express.Router();

route.post('/post', lessonController.post);
route.get('/video', lessonController.video);

module.exports = route;
