agreementApp.controller('draftAgreementsListCtrl', function($scope,agreementsApi,general) {
    $scope.agreements = [];
    $scope.callhumanReadableDate = general.callhumanReadableDate;

    agreementsApi.getAllDraftAgreements(function(res) {
      if(res.ok) {
        console.log('res ',res)
        $scope.agreements = res.list;
      }
    });
    $scope.view = function(id) {
      agreementsApi.getOneAgreement(id,1);
    };
});
