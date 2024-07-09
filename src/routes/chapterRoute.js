const express = require('express');
const chapterController = require('../controllers/chapterController');
const registerRoute = require('../utils/registerRoute');

const router = express.Router();

const routes = [{ method: 'post', path: '/post', action: 'post' }];

registerRoute(router, routes, chapterController);

module.exports = router;
