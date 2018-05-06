caseServices.controller('createCasesCtrl', function($scope,caseApi) {
  $scope.caseMessage = "";
  $scope.createCase = function(case1) {
    $scope.case = {title: '', info: ''};
    caseApi.createCase(case1,function(res) {
      $scope.caseMessage = res.message;
      swal({
        type: res.ok ? 'success' : 'error',
        html: `<h3 class='f3 black-70'> Created a case </h3>
                you can create Sessions linked to this case.
              `,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonText:
          'Create a Brāv session',
        
      }).then(function() {
          window.location = '#/ms/new';
      });
    });
  };
});
