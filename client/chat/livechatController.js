

angular.module("crowdcart.livechatController", [])

.controller('livechatController', ['$scope', 'chatSocket', function($scope, chatSocket){
  Socket.connect();
  $scope.users =  [];
  $scope.message = [];
  var promptUsername = function(message){
    bootbox.prompt(message, function(name){
      if(name !== null){
        Socket.emit('add-user', {username: name})
      }else{
        promptUsername("You must enter a username")
      }
    })
  }
  $scope.sendMessage = function(msg){
    if(msg !== null && msg !== ''){
      Socket.emit('message', {message: msg})
      $scope.msg = '';
    }
  };

  promptUsername("what is your name?");

  Socket.emit('request-users', {});

  Socket.on('users', function(data){
    $scope.users = data.users;
  });

  Socket.on('message', function(data){
    $scope.message.push(data);
  });

  Socket.on('add-user', function(data){
    $scope.users.push(data.username);
    $scope.message.push({username: data.username, message: 'has entered the channel'});
  });

  Socket.on('remove-user', function(data){
    $scope.users.splice($scope.users.indexOf(data.username), 1);
    $scope.messages.push({username: data.username, message: 'hase left the channel'});
  });

  Socket.on('prompt-username', function(data){
    promptUsername(data.message);
  });

  $scope.on('$locationChangeStart', function(event){
    Socket.disconnect();
  });

}]);