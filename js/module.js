'use strict';

var app = angular.module('fireapp', ['firebase', 'ui.router', 'ngStorage', 'angularMoment']);

app.constant('fbUrl', 'https://jmmphotos.firebaseio.com/');


app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', { url: '/', templateUrl: 'html/home.html' })
  .state('user', { url: '/user', template: '<ui-view/>', abstract: true})
  .state('user.login', {url: '/login', templateUrl: 'html/user.html', controller: 'userCtrl' })
  .state('user.register', {url: '/register', templateUrl: 'html/user.html', controller: 'userCtrl' })

  .state('user.profile', {url: '/profile', templateUrl: 'html/profile.html', controller: 'profileCtrl',
    onEnter: function($state, fbAuth){
      if( !fbAuth.$getAuth() ){
        return $state.go('login');
      }
    }
  })

  .state('chat', {url: '/chat', templateUrl: 'html/chat.html', controller: 'chatCtrl',
    onEnter: function($state, fbAuth){
      if( !fbAuth.$getAuth() ){
        return $state.go('login');
      }
    }
  })


  $urlRouterProvider.otherwise('/');
});


app.filter('titlecase', function(){
  return function(value){
    if(typeof value !== 'string') return value;
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
  }
})
