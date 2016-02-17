
var app = angular.module('fireapp')

app.controller('mainCtrl', function($scope, $window, $firebaseArray, User){

  $scope.user = User;

});



app.controller('userCtrl', function($scope, $state, AuthSvc, fbAuth, $firebaseAuth, $localStorage){


  $scope.state = $state.current.name.split('.')[1];

  $scope.submit = function(user){


    if($scope.state === 'login'){
      if(user.email.length + user.password.length > 2){
        AuthSvc.login(user)
        .then(function(response){
          $localStorage.authData = response;
          $state.go('user.profile');

        }, function(){
          user.password = '';
          alert('invalid email or password!');
        })
      }
    }
    else {

      if(user.password !== user.password2){
        user.password = user.password2 = '';
        return alert('password must match')
      }

      AuthSvc.register(user)
      .then(function(authData){
        $state.go('user.login');
      })
      .catch(function(err){
        user.password = '';
        alert('there was an error registering!');
      });

    }

    }

});



app.controller('navCtrl', function($scope, $state, AuthSvc, fbAuth, $firebaseAuth){
  fbAuth.$onAuth(function(authData){
    $scope.authData = authData;
  });

  $scope.logout = function(){
    AuthSvc.logout();
    $state.go('home');
  }
});



app.controller('profileCtrl', function($scope, $state, AuthSvc, fbAuth, $firebaseAuth, $localStorage, Profile){

  $scope.change = false;
  //getuid
  var authData = $localStorage.authData;

  var profile = Profile(authData.uid);

  profile.$loaded()
    .then(function(data){
      profile.$bindTo($scope, "profile");

      if(!profile.profileImg){
        profile.profileImg = authData.password.profileImageURL || 'https://www.governmentjobs.com/Content/Images/Icons/profile-icon.png';
      }



    })


    $scope.changePic = function(){
      $scope.change = !$scope.change;
    }

});


app.controller('chatCtrl', function($scope, $state, AuthSvc, fbAuth, $firebaseAuth, $localStorage, ProfileSvc, Messages){



  $scope.ready = false;
  var userUID = $localStorage.authData.uid;
  var userProfile = ProfileSvc.getProfile(userUID);


  $scope.messages = Messages;

  $scope.messages.$loaded()
    .then(function(data){

      $scope.ready = true;

    })



  $scope.add = function(messageObj){

    var time = Date();

    messageObj.timestamp = time;
    messageObj.userHandle = userProfile.handle;
    messageObj.userUID = userProfile.$id;
    messageObj.userIMG = userProfile.profileImg;
    $scope.messages.$add(messageObj);
  };


});



app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || element[0].dataset.val || 'oops!');
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
