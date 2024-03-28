import userRoute from './userRoute';

const route = (app) => {
    // app.get('/', (req, res) => {
    //     res.render('home');
    // });

    app.use('/user', userRoute);
};

module.exports = route;
