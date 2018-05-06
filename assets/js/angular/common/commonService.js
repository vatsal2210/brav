angular
  .module('brav')
  .factory('commonService', commonService);

commonService.$inject = ['$q', '$http', 'notificationService'];

function commonService($q, $http, notificationService) {

  var CommonService = {
    addCall: addCall,
    deleteCall: deleteCall,
    editCall: editCall,
    formValNotManditory: formValNotManditory,
    getSessionData: getSessionData,
    isEmail: isEmail
  };

  return CommonService;

  function addCall(uri, data) {
    var deferred = $q.defer();
    if (uri && data) {
      if (data.hasOwnProperty("$$hashKey")) {
        delete data['$$hashKey'];
      }
      $http({
        method: "POST",
        url: uri,
        data: data
      }).then(function (response) {
        console.log('response', response.data);
        deferred.resolve(response.data);
      }, function (error) {
        console.log('error', error);
        deferred.reject(error);
      });
    } else deferred.reject({
      msg: 'Data / Url is undefined'
    });
    return deferred.promise;
  }

  function deleteCall(uri, data) {
    var deferred = $q.defer();
    if (uri && data) {
      if (data.hasOwnProperty("$$hashKey")) {
        delete data['$$hashKey'];
      }
      $http({
        method: "DELETE",
        url: uri,
        data: data
      }).then(function (response) {
        deferred.resolve(response.data);
      }, function (error) {
        deferred.reject(error);
      });
    } else deferred.reject({
      msg: 'Data / Url is undefined'
    });
    return deferred.promise;
  }

  function editCall(uri, data) {
    var deferred = $q.defer();
    if (uri && data) {
      if (data.hasOwnProperty("$$hashKey")) {
        delete data['$$hashKey'];
      }
      $http({
        method: "PUT",
        url: uri,
        data: data
      }).then(function (response) {
        deferred.resolve(response.data);
      }, function (error) {
        deferred.reject(error);
      });
    } else deferred.reject({
      msg: 'Data / Url is undefined'
    });
    return deferred.promise;
  }

  function formValNotManditory(formName, data) {
    var deferred = $q.defer();
    if (formName && data) {
      angular.forEach(formName.$$element[0].elements, function (element) {
        if (data[element.name] == null)
          if ((!data.hasOwnProperty(element.name) && element.name != '') || ((data[element.name] == undefined || data[element.name] == null) && element.name != ''))
            data[element.name] = '';
      });
      delete data[''];
      deferred.resolve(data);
    } else {
      deferred.reject({
        msg: 'Formname / Form data is undefined'
      });
    }
    return deferred.promise;
  }

  function getAllCall(uri) {
    var deferred = $q.defer();
    if (uri) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: uri
      }).then(function (response) {
        deferred.resolve(response.data);
      }, function (error) {
        deferred.reject(error);
      });
    } else deferred.reject({
      msg: 'Url is undefined'
    });
    return deferred.promise;
  }

  function getByIdCall(uri, data) {
    var deferred = $q.defer();
    if (data && uri) {
      $http({
        method: "GET",
        url: uri,
        params: data
      }).then(function (response) {
        deferred.resolve(response.data);
      }, function (error) {
        deferred.reject(error);
      });
    } else {
      deferred.reject({
        msg: 'Data / Url is undefined'
      });
    }
    return deferred.promise;
  }

  function isEmail(email) {
    if (email && (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(email)) {
      return true;
    } else {
      notificationService.error('Please enter valid email');
      return false;
    }
  }

  function getSessionData(){
    if (sessionStorage.getItem('bravUser')){
      return JSON.parse(sessionStorage.getItem('bravUser'));
    }else return false;
  }
}
