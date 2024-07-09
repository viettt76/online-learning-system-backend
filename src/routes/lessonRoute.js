const express = require('express');
const lessonController = require('../controllers/lessonController');
const registerRoute = require('../utils/registerRoute');

const router = express.Router();

const routes = [
    { method: 'post', path: '/post', action: 'post' },
    { method: 'get', path: '/video', action: 'video' },
];

registerRoute(router, routes, lessonController);

module.exports = router;
