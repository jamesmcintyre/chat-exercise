
var app = angular.module('fireapp')

app.controller('mainCtrl', function($scope, $window, $firebaseArray, List, User){

  $scope.list = List;

  //$scope.makelist = function(name){
  // MakeList('clogs');
  // }

  $scope.add = function(text){
    $scope.list.$add(text);
  };


  $scope.user = User;

});
//
// Auth.login()
// Auth.register()


app.controller('userCtrl', function($scope, $state, AuthSvc, fbAuth, $firebaseAuth, $localStorage){

  console.log('userCtrl');
  console.log($state.current);

  $scope.state = $state.current.name.split('.')[1];

  $scope.submit = function(user){


    if($scope.state === 'login'){
      if(user.email.length + user.password.length > 2){
        AuthSvc.login(user)
        .then(function(response){
          console.log(response);
          $localStorage.authData = response;
          $state.go('home');

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
        console.log(authData);
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
    console.log('authdata', authData);
    $scope.authData = authData;
  });

  $scope.logout = function(){
    AuthSvc.logout();
    $state.go('home');
  }
});



app.controller('profileCtrl', function($scope, $state, AuthSvc, fbAuth, $firebaseAuth, $localStorage, Profile){
  console.log('profile controller');

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
      
      console.log(authData.password.profileImageURL+'   '+profile.profileImg);

    })


    $scope.changePic = function(){
      $scope.change = !$scope.change;
    }
  //$scope.profile.firstName = 'James';

  //$scope.profile.$save()

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
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
