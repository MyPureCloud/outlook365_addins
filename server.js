var http = require("http");
var fs = require("fs");
var https = require("https");

var express = require('express');
var app = express();


app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get("/test.html", function(req, res){
    res.redirect("directory.html");
})

var sslOptions = {
    key: fs.readFileSync('ssl/localhost.key'),
    cert: fs.readFileSync('ssl/localhost.crt'),
    ca: fs.readFileSync('ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};


var httpServer = http.createServer(app);
var httpsServer = https.createServer(sslOptions, app);

var httpsPort = 8080;
console.log("starting on " + httpsPort);

httpsServer.listen(httpsPort);
