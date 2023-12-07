const express = require('express');
const router = require('./app/routers/main.router');
const app = express();
const cors = require('cors')
const multer = require("multer")
const path = require("path")


const host = '0.0.0.0';
const port = 7000;

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use('/api', router);
app.use('/image', express.static('upload/images'));

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
});
