var express = require('express');
var https = require('https');
var fs = require('fs');
var socket = require('socket.io');
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var sdk = require('azure-iot-device');

const port = '8080';
const connString = "YOUR_DEVICE_CONNECTION_STRING";

// parameters for https connection
var options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
    ca: fs.readFileSync('certs/ca-cert.pem')
};

var app = express();
app.use(express.static('public'));
app.use(express.json());

var server = https.createServer(options, app).listen(port, function() {
    console.log("Listening on port 8080");
});

// init MQTT Azure client
var client = sdk.Client.fromConnectionString(connString, Protocol);
client.open(function(err) {
    if(err) console.error("Could not connect: "+err.message);
});

var io = socket(server);
io.on('connection', function(socket) {
    console.log("Socket connected");
    socket.on('disconnect', function() {
        console.log("Socket disconnected");
    });
    socket.on('data', function(data) {
        console.log(data);
        var eventMsg = new sdk.Message(JSON.stringify(data));   // send event data to the Hub
        client.sendEvent(eventMsg, function(err) {
            if(err) console.log("Error: "+err.toString());
        });
    });
});
