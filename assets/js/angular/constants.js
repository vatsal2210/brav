(function () {
  'use strict';

  var appUrl = "http://localhost:1337/";
  //   var appUrl = "http://localhost:3000/"; //live

  var apiRoutesUrl = {
    appUrl: appUrl,

    // user
    login: appUrl + 'user/login',
    register: appUrl + 'user/register',
    singleUser: appUrl + 'user/single',
  };

  angular.module('brav').constant('constants', apiRoutesUrl);

})();
