caseServices.controller('allRequestsCtrl', function($scope,msApi,chatApi) {
      $scope.sessions = [];
      msApi.getAllRequests(function(response) {
        console.log(response);
        $scope.sessions = response.sessions;
      });
      $scope.viewSession = function(id) {
        msApi.setSessionRequestId(id);
        console.log("id",id);
        window.location = '#/ms/request';
      };
});

