import userRoute from './userRoute';
import courseRoute from './courseRoute';

const route = (app) => {
    // app.get('/', (req, res) => {
    //     res.render('home');
    // });

    app.use('/user', userRoute);
    app.use('/course', courseRoute);
};

module.exports = route;
