const express = require('express');
const userController = require('../controllers/userController');

let route = express.Router();

route.post('/login', userController.login);
route.post('/logout', userController.logout);
route.get('/personal-info', userController.personalInfo);
route.patch('/is_teacher', userController.isTeacher);
route.get('/teacher/search', userController.searchTeacher);
route.get('/teacher/detail', userController.teacherDetail);

module.exports = route;
