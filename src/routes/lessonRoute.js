const express = require('express');
const lessonController = require('../controllers/lessonController');

const route = express.Router();

route.post('/post', lessonController.post);
route.get('/video', lessonController.video);

module.exports = route;
