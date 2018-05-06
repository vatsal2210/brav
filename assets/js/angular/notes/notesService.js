angular
  .module('brav')
  .factory('notesService', notesService);

notesService.$inject = ['notificationService'];

function notesService(notificationService) {

  var NotesService = {};

  return NotesService;
}
