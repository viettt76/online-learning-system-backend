require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const viewEngine = require('./config/viewEngine');
const routes = require('./routes');
const handleMiddleware = require('./config/handleMiddleWare');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

app.use(handleMiddleware.errorHandler);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

viewEngine(app);

routes(app);
connectDB();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
