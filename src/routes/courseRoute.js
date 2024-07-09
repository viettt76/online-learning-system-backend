const express = require('express');
const courseController = require('../controllers/courseController');
const registerRoute = require('../utils/registerRoute');

const router = express.Router();

const routes = [
    { method: 'get', path: '/all', action: 'getAll' },
    { method: 'get', path: '/detail', action: 'getDetail' },
    { method: 'post', path: '/post', action: 'post' },
    { method: 'get', path: '/teaching', action: 'teaching' },
    { method: 'get', path: '/search', action: 'search' },
    { method: 'put', path: '/update-info', action: 'updateInfo' },
    { method: 'get', path: '/favorite', action: 'favorite' },
    { method: 'post', path: '/favorite/add', action: 'addFavorite' },
    { method: 'get', path: '/cart', action: 'cart' },
    { method: 'post', path: '/cart/add', action: 'addCart' },
    { method: 'get', path: '/purchased', action: 'purchased' },
    { method: 'post', path: '/purchased/add', action: 'addPurchased' },
];

registerRoute(router, routes, courseController);

module.exports = router;
