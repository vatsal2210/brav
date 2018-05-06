iApp.controller('accountICtrl', function($scope,iApi) {
 $scope.user={name:'sample user name',email:'sample_email@brav.org'}
  iApi.getProfile(function (obj) {
    $scope.user = obj ;
  });
});
