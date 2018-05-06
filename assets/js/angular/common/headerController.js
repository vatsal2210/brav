angular
  .module('brav')
  .controller('headerController', headerController);

headerController.$inject = ['$scope', '$location'];

function headerController($scope, $location) {
  var HSC = this;
  HSC.isHeaderView = false;

  $scope.$on('$routeChangeStart', function () {
    console.log('route changed')
    if ($location.path() == '/' || $location.path() == '/register') {
      deleteSession();
      HSC.isHeaderView = false;
    } else {
      HSC.isHeaderView = true;
    }
  });

  function deleteSession() {
    if (sessionStorage.getItem('bravUser')) sessionStorage.removeItem('bravUser')
  }
}
