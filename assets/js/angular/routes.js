angular.module('brav')
  .config(function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/userLogin.html',
        controller: 'userController as USC'
      })
      .when('/register', {
        templateUrl: 'templates/userRegister.html',
        controller: 'userController as USC'
      })
      .when('/profile', {
        templateUrl: 'templates/userProfile.html',
        controller: 'userController as USC'
      })
      .when('/schedule', {
        templateUrl: 'templates/scheduleView.html',
        controller: 'scheduleController as SSC'
      })
      .when('/schedule/add', {
        templateUrl: 'templates/scheduleAdd.html',
        controller: 'scheduleController as SSC'
      })
      .when('/schedule/done', {
        templateUrl: 'templates/scheduleThank.html',
        controller: 'scheduleController as SSC'
      })
      .when('/mediator/:id', {
        templateUrl: 'templates/mediator.html',
        controller: 'mediatorController as MSC'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
