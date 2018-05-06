angular
  .module('brav')
  .factory('scheduleService', scheduleService);

scheduleService.$inject = ['notificationService'];

function scheduleService(notificationService) {

  var ScheduleService = {};

  return ScheduleService;
}
