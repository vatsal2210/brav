var agreementApp = angular.module('bravApp.agreement', [
  'ngRoute', 'ngclipboard', 'bravAuthModule','angularTrix'
]);

agreementApp.config(function ($routeProvider) {
  $routeProvider
    .when("/agreements/new", {
      templateUrl: 'pages/Agreement/html/create.html',
      controller: 'agreementCreateCtrl'
    })
    .when("/agreements/read", {
      templateUrl: 'pages/Agreement/html/read.html',
      controller: 'agreementReadCtrl'
    })
    .when("/agreements/drafts", {
      templateUrl: 'pages/Agreement/html/drafts.html',
      controller: 'draftAgreementsListCtrl'
    })
    .when("/agreements/drafts/shared", {
      templateUrl: 'pages/Agreement/html/shared.html',
      controller: 'sharedAgreementsListCtrl'
    })
    .when("/agreements/signed", {
      templateUrl: 'pages/Agreement/html/signedlist.html',
      controller: 'signedAgreementsListCtrl'
    })
    .when("/agreements/requests", {
      templateUrl: 'pages/Agreement/html/requests.html',
      controller: 'agreementSigningRequestsListCtrl'
    });
});

agreementApp.service('agreementsApi',function($http,bravAuthData){
  let self = this;
  /** TODO NOW : helper stuff  DONE*/
  this.getHelperData=function(next){
    console.log("calling api helpers");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/helpers",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": ""
    };
    $http(settings).success(next);
    /** {
            ok:true,
            checklist : [
                `All parties intend to be bound are mentioned.`,
                `Any and all parties necessary for agreement to be binding have signed, acknowledge and understand agreement.`
                `Mentions a valid date, clear full, legal names of any and all parties involved`,
                `terms of the agreement are definite and certain`,
                `mentioned the jurisdiction you wish to follow`,
                `is signed fully within a month of creating.`,
                `parties signed are at least 18 unless providing legal guardin's sign as well.`
            ],
            snippets:[
                {id:101,tags:['family','divorce'],text:'All 1 the above mentioned parties must follow the dog rules'},
                {id:102,tags:['contract','immigration'],text:'immigration 2 the above mentioned parties must follow the dog rules'},
                {id:103,tags:['family','immigration'],text:'Having 3 the above mentioned parties must follow the dog rules'},
            ],
            boilerplates:[
                {id:101,tags:['family','divorce'],name:'Bird Agreement'},
                {id:102,tags:['contract','immigration'],name:'Immigration of Bylaws'},
                {id:103,tags:['family','immigration'],name:'Dog Sitting Agreement'},
            ]

    } */
  };

  /** TODO NOW : this boilerplate will replace the agreement DONE*/
  this.getBoilerPlate =function(id,next){
    console.log("calling api getBoilerPlate");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/boilerplate",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": {id:id}
    };
    $http(settings).success(next); // response.plate.content
  };

  /** TODO NOW DONE */
  this.createAgreement=function(agreementDetails,next){
    /*** Must send following
     *  title:'string',
    description:'string',
    involvedParties: 'array' , // [string array]
     */
    console.log("calling create");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/create",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(agreementDetails)
    };
    $http(settings).success(next);// will execute next({ok:true,id:'887669kjnk'}) on success
  };

  /** TODO NOW : call server and upon success, refresh whole page to delete all data about this agreement */
  this.discardNonFinalAgreement=function(id,next){
    console.log("calling discard");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/update",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({id:id,discard:true})
    };
    $http(settings).success(next);// will execute next({ok:true}) on success
  };

  /** TODO NOW : push all to server with descr and all with optional fields DONE*/
  this.updateAgreement=function(id,agreementDetails,next){
    /***  you can send any of following stuff:  all are optional but id is important
     *   title:'string',
         description:'string',
         checklist:'array', // [{item, checked }]
         content:'json', // {html:"written in ng-medium editor"}
         involvedParties: 'array' , // [email1,mail2,mail3] direct strings in array
     *
     */
    agreementDetails.id = id;
    console.log("calling update");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/update",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(agreementDetails)
    };
    $http(settings).success(next);// will execute next({ok:true}) on success
  };

  /** TODO NOW : push to server DONE*/
  this.saveModifiedContent= function(data,next){
    console.log("calling Save ",data);
    // params : content , checklist
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/save",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(data)
    };
    $http(settings).success(next);
  };

  /** TODO NOW : restore from server DONE*/
  this.getLastSaved= function(id,next){
    console.log("calling getLastSaved");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/content",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": {id:id}
    };
    $http(settings).success(function (response) {
      let mock =
        {ok:true,
         agreement:{
          title:'Dogs Agreement',
          checklist:[
                {checked:true,item:'add a date to agreement'},
                {checked:false,item:'add all binding parties to the agreement'}
             ]
          },
          content:{
            html:' Agreemnet one  \n ss  big text s sa tasa kasa he asa kasa'
          }
        }
       next(response)
    });
  };

  /** TODO NOW : it will make agreement read only forever DONE*/
  this.finalize=function(id,next){
    console.log("calling finalize");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/finalize",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({id:id})
    };
    $http(settings).success(next);
  };

  let currentAgreementStuff = false;
  this.setAgreementStuff = function(data) {
    currentAgreementStuff = data;
  };
  this.getAgreementStuff = function() {
    let objectToGiveBack =currentAgreementStuff ;
    currentAgreementStuff = false ;
    return objectToGiveBack;
  }

  this.getAllDraftAgreements= function(next){
    console.log("calling drafts");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/drafts",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": ""
    };
    $http(settings).success(next);
  };

  this.getAllSharedDraftAgreements= function(next){
    console.log("calling drafts/shared");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/drafts/shared",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": ""
    };
    $http(settings).success(next);
  };

  this.getAllAgreementSigningRequests= function(next){
    console.log("calling /common/api/agreement/requests");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/requests",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": ""
    };
    $http(settings).success(next);
  };

  this.getAllSignedAgreements= function(next){
    console.log("calling /common/api/agreement/requests");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/signed",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params":""
    };
    $http(settings).success(next);
  };

  this.getOneAgreement= function(id,type){
    console.log("calling getone");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/one",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": {id:id,accessType:type}
    };
    $http(settings).success(function(res){
       if(res.ok){
          if(res.agreement.accessType==1){
            res.agreement.editable= true;
            res.agreement.finalized= false ;
            console.log(res);
            self.setAgreementStuff(res.agreement);
            window.location = '#/agreements/new';
          }
          else if(res.agreement.accessType<5 && res.agreement.accessType>1){
            self.setAgreementStuff(res.agreement);
            window.location = '#/agreements/read';
          }else{
            alert('Issue : no such access granted for this agreement');
          }
       }
    });
  };

  this.sign=function(id,accept,next){
    // sign object must contain
    // accept
    console.log("calling sign");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/agreement/sign",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({id:id,accept:accept})
    };
    $http(settings).success(next);
  };

});
