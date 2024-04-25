const userRoute = require('./userRoute');
const courseRoute = require('./courseRoute');
const chapterRoute = require('./chapterRoute');
const lessonRoute = require('./lessonRoute');

const route = (app) => {
    app.use('/user', userRoute);
    app.use('/course', courseRoute);
    app.use('/chapter', chapterRoute);
    app.use('/lesson', lessonRoute);
};

module.exports = route;
