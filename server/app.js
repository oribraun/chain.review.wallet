var express = require('express');
var session = require('express-session');
var cors = require('cors');
var bodyParser = require("body-parser");
// var fs = require('fs-extra');
// const execFile = require('child_process').execFile;
const wallet_commands = require('./wallet_commands');
// const exec = require('child_process').exec;
var app = express();
var http = require('http').createServer(app);
// // var io = require('socket.io')(http);
// var updateDbCron = require('./cronJobs/update_db');
// var isWin = process.platform === "win32";
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./routes');

app.set('trust proxy', 1);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false ,
    cookie: { secure: false, maxAge: 1000*60*60*24 }
}))

// app.use(cors());
http.setTimeout(1000*60*3); // 3 minutes timeout
http.listen(port, function() {
    console.log('Server Works !!! At port ' + port);
});

// var wallet = process.argv[2];
//
// if(settings[wallet]) {
//     db.connect(settings[wallet].dbSettings);
// } else {
//     console.log('no database found');
// }
//
// process.on('SIGINT', function() {
//     // console.log("Caught interrupt signal");
//     db.disconnect();
//     process.exit();
// });
var addToHeader = function (req, res, next) {
    var err = null;
    try {
        decodeURIComponent(req.path);
    } catch (e) {
        err = e;
    }
    if(err) {
        var baseUrl = req.connection.encrypted ? 'https://' : 'http://';
        baseUrl += req.get('Host');
        var index = baseUrl.indexOf('#');
        if (index > 0) {
            baseUrl = baseUrl.substring(0, index);
        }
        return res.redirect([baseUrl + '#'].join(''));
        // res.send(404);
    }
    // res.header('Content-Type', 'application/json');
    // console.log("add to header called ... " + req.url + " origin - " + req.headers.origin);
    // // res.header("charset", "utf-8")
    // var allowedOrigins = ["http://localhost:3000", "http://52.0.84.174:3000", "http://52.0.84.174:8080", "http://cp.fitracks.net", "http://controlpanel.aetrex.com", "http://52.70.32.87", "http://54.174.118.86"];
    // var origin = req.headers.origin;
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    // if(allowedOrigins.indexOf(origin) > -1){
    //     res.header("Access-Control-Allow-Origin", origin);
    // }
    // res.header("Access-Control-Allow-Credentials", true);
    // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // res.header("Content-Type", "application/json");
    next();
};

app.use('/', addToHeader, routes);


