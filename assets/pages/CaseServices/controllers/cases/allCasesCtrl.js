caseServices.controller('allCasesCtrl', function($scope,caseApi,tableDefaultOptions) {

  $scope.tableDefaultOptions = tableDefaultOptions;

  $scope.getAllCases = function() {
    caseApi.getAllCases(function(res) {
      $scope.cases = res.cases;
      console.log($scope.cases);
    });
  };

  $scope.modifyCase = function(title,index) {
      function afterEdit(case1) {
          caseApi.modifyCase(case1,function(res) {
           if(res.ok) {
            $scope.cases =
              $scope.cases.filter(function(currentCase) {
                if(currentCase['_id'] == index)
                  currentCase.info = case1.info;
                return currentCase;
              });
           }
          });
      };

      swal({
        title: 'Enter New Info',
        type: 'info',
        input: 'text',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText:
          'Change Info',
        cancelButtonText:
          'Cancel'
        })
      .then(text => {
          var case1 = {
            title: title,
            info: text
          };
          afterEdit(case1);
        });
      };
});
