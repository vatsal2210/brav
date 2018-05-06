caseServices.service('caseApi',function($http,bravAuthData) {
  // Cases api in V3.0
  this.createCase = function (sessionObject,next) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/case/create",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(sessionObject)
    }
    $http(settings).success(next);
  };

  this.getAllCases = function (next) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/case/getAll",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": ""
    }
    $http(settings).success(next);
  };

  this.modifyCase = function (modifiedCase,next) {
    var settings = {
      "async": true,
      "crossDomain": true,
        "url": "/common/api/case/modify",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "x-access-token": bravAuthData.auth.token
        },
        "data":  bodyparser({title: modifiedCase.title, info: modifiedCase.info})
      }
      $http(settings).success(next);
  };

});
