const express = require('express');
const userController = require('../controllers/userController');

let route = express.Router();

route.post('/create', userController.create);
route.patch('/is_teacher', userController.isTeacher);

module.exports = route;
