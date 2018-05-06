caseServices.controller('allSessionsCtrl', function($scope,msApi) {
    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.limitOptions = [5, 10, 15];
    $scope.sessions =[];
    
    console.log('loaded allSessionsCtrl')
    msApi.getAllSessions(function(response){
        console.log('sessions',response);
        $scope.sessions = response.sessions.map(o=>{
          if(o.schedule){
            o.schedule.str = o.schedule.epoch?new Date(o.schedule.epoch).toString():'Not Scheduled yet';
            o.schedule.fromNow  = moment(new Date(o.schedule.epoch),"YYYYMMDD").fromNow();
          }
          return o;
        });
    });

    $scope.joinSession = function(_id) {
      //msApi.setMediationSessionStuff(false);
      msApi.setSessionRequestId(_id);
      msApi.openMediationSession();
    };

    /*    
      $scope.joinSessionsTest = function($index) {
        msApi.setMediationSessionStuff($scope.sessions[$index]);
        window.location = '#/ms/s';
      };
    */   

});
