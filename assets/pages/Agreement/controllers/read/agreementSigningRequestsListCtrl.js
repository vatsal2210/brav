agreementApp.controller('agreementSigningRequestsListCtrl', function($scope,agreementsApi) {
   $scope.agreements = [];
   agreementsApi.getAllAgreementSigningRequests(function(res) {
     console.log('res ',res)
      if(res.ok) {
        $scope.agreements = res.list;
      }
   });

  $scope.view = function(id) {
    agreementsApi.getOneAgreement(id,3);
  };

});
