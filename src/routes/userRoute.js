const express = require('express');
const userController = require('../controllers/userController');
const registerRoute = require('../utils/registerRoute');

const router = express.Router();

const routes = [
    { method: 'post', path: '/login', action: 'login' },
    { method: 'post', path: '/logout', action: 'logout' },
    { method: 'post', path: '/verify-token', action: 'verifyToken' },
    { method: 'get', path: '/personal-info', action: 'personalInfo' },
    { method: 'patch', path: '/is_teacher', action: 'isTeacher' },
    { method: 'get', path: '/teacher/search', action: 'searchTeacher' },
    { method: 'get', path: '/teacher/detail', action: 'teacherDetail' },
];

registerRoute(router, routes, userController);

module.exports = router;
