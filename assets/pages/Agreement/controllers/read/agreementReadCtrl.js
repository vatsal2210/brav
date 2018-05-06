agreementApp.filter('sce', ['$sce', function ($sce) {
    return $sce.trustAsHtml;
}]);

agreementApp.controller('agreementReadCtrl', function($scope,agreementsApi,$mdToast,bravUI) {
  let toRead = agreementsApi.getAgreementStuff();
  $scope.wholeNewScope = function() {
    $scope.thisAgreementStuff = {
      involvedParties :[],
    };
    $scope.helperStuff = {checklist:[]};
    $scope.content = '';
    console.log('initialized whole new scope for agreements creator')
  };
  if(!toRead){
    console.log('nothing to read');
    window.location ='#/'
  }else{
    $scope.wholeNewScope();
    $scope.thisAgreementStuff = toRead ;
    $scope.content = $scope.thisAgreementStuff.content ;
    $scope.READ_NON_FINAL = $scope.thisAgreementStuff.accessType ==2;
    $scope.READ_FINAL = $scope.thisAgreementStuff.accessType ==3;
    $scope.READ_SIGNED = $scope.thisAgreementStuff.accessType ==4;
    $scope.READY_TO_SIGN = false;

    if($scope.READ_FINAL){
      $scope.signOnTheAgreement = function(accept) {
        agreementsApi.sign($scope.thisAgreementStuff._id,accept,function(res) {
          if(res.ok){
            bravUI.showSimpleToast('Successfully Signed the Agreement as '+ (accept ?'Accepted':'Denied'));
            $scope.READ_SIGNED = true;
            $scope.READ_FINAL = false;
            $scope.mySign = accept;
          }
        });
      };
    }

    if($scope.READ_SIGNED){
      $scope.mySign = ("true"==$scope.thisAgreementStuff.mySign.accepted);
    }

    $scope.lastSaved = function() {
      agreementsApi.getLastSaved($scope.thisAgreementStuff._id,function(res) {
        console.log('response of getlastSaved ',res);
        if(res.ok) {
          $scope.content = res.stuff.content || $scope.content;
          if(res.stuff.checklist)
          {
            $scope.helperStuff.checklist = res.stuff.checklist.map(function(item){
              item.checked = item.checked=="true";
              return item;
            }) || $scope.helperStuff.checklist;
          }
        }
      });
    };
    $scope.readyToSign=function(){$scope.READY_TO_SIGN=true;};
  }
});
