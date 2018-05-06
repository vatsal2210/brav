agreementApp.controller('sharedAgreementsListCtrl',function($scope,agreementsApi) {
   $scope.agreements = [];
   agreementsApi.getAllSharedDraftAgreements(function(res) {
      if(res.ok) {
        console.log('res ',res)
        $scope.agreements = res.list;
      }
   });

  $scope.view = function(id) {
    agreementsApi.getOneAgreement(id,2);
  };

});
