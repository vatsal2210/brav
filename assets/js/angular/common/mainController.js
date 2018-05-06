angular
  .module('brav')
  .controller('mainController', mainController);

mainController.$inject = ['$scope', '$location'];

function mainController($scope, $location) {
  var MSC = this;
  MSC.isHeaderView = false;

  $scope.$on('$routeChangeStart', function () {
    console.log('route changed')
    if ($location.path() == '/' || $location.path() == '/register') {
      deleteSession();
      MSC.isHeaderView = false;
    } else {
      MSC.isHeaderView = true;
    }
  });

  function deleteSession() {
    if (sessionStorage.getItem('bravUser')) sessionStorage.removeItem('bravUser')
  }
}
