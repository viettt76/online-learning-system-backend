require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const viewEngine = require('./config/viewEngine');
const routes = require('./routes');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);

routes(app);
connectDB();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
