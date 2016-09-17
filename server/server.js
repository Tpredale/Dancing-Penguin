// require express, mongoose, middleware, routes
var express = require('express');
var middleware = require('./config/middleware.js');
var mongoose = require('mongoose');
var routes = require('./config/routes.js');
var app = express();
var server = require('http').createServer(app);
var users = [];


// set mongoURI
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/crowdcart';

// connect db
mongoose.connect(mongoURI);

// set port
var port = process.env.PORT || 8080;

// listen on port
server.listen(port);

console.log("Server is listening on port " + port);


// set middleware
middleware(app, express);

// set routes
routes(app, express);

var io = require('socket.io')(server);

io.on('connection', function(socket){
  var username = '';
 console.log('a user has connected');
 socket.on('request-users', function(){
  socket.emit('users', {users: users});
 });
 socket.on('message', function(data){
  io.emit('message', {username: username, message: data.message});
 });
 socket.on('add-user', function(data){
  if(users.indexOf(data.username) === -1){
    io.emit('add-user', {
      username: data.username
    })
    username = data.username;
    users.push(data.username);
  }
  else{
    socket.emit('prompt-username', {
      message: "User Exists Already"
    });
  }
 });
 socket.on('disconnect', function(){
  console.log(username + ' has disconnected');
  users.splice(users.indexOf(username), 1);
  io.emit('remove-user', {username: username});
 });
});




// export app
module.exports = server;


