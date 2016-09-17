// require express, mongoose, middleware, routes
var express = require('express');
var middleware = require('./config/middleware.js');
var routes = require('./config/routes.js');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var users = [];


// start express

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


// set middleware
middleware(app, express);

// set routes
routes(app, express);

// export app
module.exports = server;


