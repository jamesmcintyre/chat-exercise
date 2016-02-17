
var app = angular.module('fireapp');


app.factory('fbAuth', function(fbRef, $firebaseAuth){
  return $firebaseAuth(fbRef);
})

app.service('AuthSvc', function(fbAuth, $firebaseAuth){
  this.register = function(userObj){
    return fbAuth.$createUser(userObj)
      .then(function(userData){
        console.log('user'+userData.uid + 'created successfully!');
        return fbAuth.$authWithPassword(userObj);
      });
  }
  this.login = function(userObj){
    return fbAuth.$authWithPassword(userObj);
  }

  this.logout = function(userObj){
    return fbAuth.$unauth();
  }
})


//-----------------------------

app.factory('Profile', function($firebaseObject, fbRef){

  var User = $firebaseObject.$extend({

  });

  return function(userId){
    var ref = fbRef.child('profiles').child(userId);
    return new User(ref);
  }

});

//$scope.profile = Profile(authData.uid);

//-------------------------------




app.service('ProfileSvc', function($firebaseObject, fbRef){

  this.getProfile = function(userUID){
    var profile = fbRef.child('profiles').child(userUID);
    return $firebaseObject(profile);

  }


});






///--------------------------------------- records

// app.factory('MakeList', function($firebaseArray, fbRef){
//   return function(child){
//     var listRef = fbRef.child(child);
//     return $firebaseArray(listRef);
//     }
//   }
// })


app.factory('fbRef', function($window, fbUrl){
  return new Firebase(fbUrl);
})


app.factory('Messages', function($firebaseArray, fbRef){
  var listMessages = fbRef.child('MessageHistory');
  return $firebaseArray(listMessages);
});

app.factory('User', function($firebaseObject, fbRef){
  var user = fbRef.child('user');
  return $firebaseObject(user);
});


//--------------------------------------------
