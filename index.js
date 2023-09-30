const express = require('express');
const app = express();
const router = express.Router();
const fs = require("fs");
const cors = require('cors')
const http = require('http');
const https = require('https')
const bodyParser = require('body-parser')
const CONSTANT = require("./common/constant");
const PORT = 4000;

let azure = require("./controller/azure.controller")

var server
server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "views");

app.use(function(res, req, next){
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if ('OPTIONS' == req.method){
        res.sendStatus(200);
    } else {
        next();
    }
});

app.post("/uploadImage",  azure.uploadImage);
app.post("/getAllImageList",  azure.getAllImageList);

server.listen(PORT, '0.0.0.0', function() {
    if (!fs.existsSync(CONSTANT.UPLOAD_IMAGE_PATH)) {
        fs.mkdirSync(CONSTANT.UPLOAD_IMAGE_PATH, {
          recursive: true,
        });
    }
    console.log("Express http server listening on *:" + PORT);
})