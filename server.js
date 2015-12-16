var http = require("http");
var fs = require("fs");
var https = require("https");

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var lambda = require('./src/lambda/lambda');

var logger = function(req, res, next) {
    console.log(req.originalUrl);
    next(); // Passing the request to the next handler in the stack.
}

app.use(bodyParser.json());
app.use(logger);
app.use(express.static(__dirname + "/localBuild"));
//app.use(express.static(__dirname + "/src/web"));

app.use('/github-outlook365addins', express.static(__dirname + "/localBuild"));

app.get("/test.html", function(req, res){
    res.redirect("directory.html");
})

app.post("/lambda", function(req, res){
    var context = {
        done: function (err, result) {
            res.json(result);
        }
    };
    console.log("lambda");
    console.log(req.body);
    lambda.handler(req.body, context);
});

var sslOptions = {
    key: fs.readFileSync('ssl/localhost.key'),
    cert: fs.readFileSync('ssl/localhost.crt'),
    ca: fs.readFileSync('ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

var httpServer = http.createServer(app);
httpServer = https.createServer(sslOptions, app);

var port = process.env.PORT || 8080;
console.log("starting on " + port);

httpServer.listen(port);
