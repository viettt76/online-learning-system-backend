const express = require('express');
const courseController = require('../controllers/courseController');

const route = express.Router();

route.get('/all', courseController.getAll);
route.get('/detail', courseController.getDetail);
route.post('/post', courseController.post);
route.get('/teaching', courseController.teaching);
route.get('/search', courseController.search);
route.put('/update-info', courseController.updateInfo);
route.get('/favorite', courseController.favorite);
route.post('/favorite/add', courseController.addFavorite);
route.get('/cart', courseController.cart);
route.post('/cart/add', courseController.addCart);
route.get('/purchased', courseController.purchased);
route.post('/purchased/add', courseController.addPurchased);
route.get('/test', courseController.test);

module.exports = route;
