// Get dependencies
var socket_io = require( "socket.io" );

const express = require('express');
const path = require('path');
//const http = require('http');
const bodyParser = require('body-parser');

var fs = require('fs');
var https = require('https');
var key = fs.readFileSync('./bloodonation-key.pem');
var cert = fs.readFileSync('./bloodonation-cert.pem')
var https_options = {
    key: key,
    cert: cert
};

// Get our API routes
const api = require('./server/routes/api');
const donors = require('./server/routes/donors');

const app = express();

mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/crossover', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
app.use('/api/donors', donors);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = https.createServer(https_options, app);
app.io = socket_io();
var io     = app.io
io.attach( server );


io.on('connection', function(socket){
	exports._socket = socket;
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log('API running on localhost:${port}'));