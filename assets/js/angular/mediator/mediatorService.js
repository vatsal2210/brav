angular
  .module('brav')
  .factory('mediatorService', mediatorService);

mediatorService.$inject = ['notificationService'];

function mediatorService(notificationService) {

  var mediatorService = {};

  return mediatorService;
}
