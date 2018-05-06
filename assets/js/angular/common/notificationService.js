angular
  .module('brav')
  .factory('notificationService', notificationService);

notificationService.$inject = ['$q', '$http', 'constants'];

function notificationService($q, $http, constants) {

  var NotificationService = {
    alert: alert,
    error: error,
    info: info,
    warning: warning
  };

  return NotificationService;

  function notify(data, type) {
    swal({
      title: data,
      icon: type
    })
  }

  function alert(data) {
    notify(data, 'alert')
  }

  function error(data) {
    notify(data, 'error')
  }

  function info(data) {
    notify(data, 'info')
  }

  function warning(data) {
    notify(data, 'warning')
  }

}
