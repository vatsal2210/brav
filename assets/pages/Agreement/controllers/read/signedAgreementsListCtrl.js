agreementApp.controller('signedAgreementsListCtrl',function($scope,agreementsApi,general) {
   $scope.agreements = [];
    $scope.callhumanReadableDate = general.callhumanReadableDate;

   agreementsApi.getAllSignedAgreements(function(res) {
      if(res.ok) {
        console.log('signedAgreementsList: ',res)
        $scope.agreements = res.list;
      }
   });

  $scope.view = function(id) {
    console.log(agreementsApi.getOneAgreement(id,4));
  };

});
