/**
 * Created by Omkar Dusane on 26-Oct-16.
 */

var bravAdmin = angular.module('bravApp', [
  'ngRoute','bravApp.agreement','bravAuthModule','ngclipboard','angularTrix'
  ]).config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("/profile", {
      templateUrl: 'pages/BravAdmin/html/account.html',
      controller: 'accountCtrl'
    })
    .when("/m/all", { //  mediators info table
      templateUrl : 'pages/BravAdmin/html/mediators.html',
      controller: 'mediatorCtrl'
    })
    .when("#/mo/all", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("/o/all", { // table with buttons
      templateUrl : 'pages/BravAdmin/html/org.html',
      controller: 'orgCtrl'
    })
    .when("/i/all", { // table with buttons
      templateUrl : 'pages/BravAdmin/html/ind.html',
      controller: 'indCtrl'
    })
    .when("#/admins/new", { // form
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("/admins/all", { // table with buttons
      templateUrl : 'pages/BravAdmin/html/admin.html',
      controller: 'adminCtrl'
    })
    .when("#/agreements/all", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
	  .when("/agreements/bp", { // boiler plates
      templateUrl : 'pages/BravAdmin/html/addBoiler.html',
      controller: 'boilerplateCtrl'
    })
     .when("/agreements/vbp", { // boiler plates
      templateUrl : 'pages/BravAdmin/html/viewBoiler.html',
      controller: 'boilerplateCtrl'
    })

     .when("/agreements/snippets",{//snippets
      templateUrl : 'pages/BravAdmin/html/manageSnippets.html',
      controller : 'snippetsCtrl'
    })
    .when("#/cases/all", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("#/sessions/all", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("#/credits/mapper", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("#/plans/all", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("#/payments/in", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("#/payments/out", { // table with buttons
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    ;

});


bravAdmin.controller('sidebarLinksCtrl',function (bravHomeApi) {
  /** Links here */

  bravHomeApi.setLinksList([
  {
    title:'Profile',
    src: "img/Icons/Profile.png",
    href: "#/profile",
    nest:false
  },
  // mediators
  {
    title:'Mediators',
    src: "img/Icons/Mediators.png",
    nest:true,
    sub:
      [
        {
          title:'All Mediators',
          src: "img/Icons/AllMediators.png",
          href:'#/m/all'
        },
        {
          title:'All Mediator organisations',
          src: "img/Icons/AllMediatorOrganizations.png",
          href:'#/mo/all'
        }
      ]
  },
  // orgs
  ,
  {
    title:'Organizations',
    src: "img/Icons/Organizations.png",
    nest:true,
    sub:
      [
        {
          title:'Manage all',
          src: "img/Icons/ManageAll(Organizations).png",
          href:'#/o/all'
        }
      ]
  },
  // Individuals
  {
    title:'Individuals',
    src: "img/Icons/Individuals.png",
    nest:true,
    sub:
      [
        {
          title:'Manage all',
          src: "img/Icons/ManageAll(Individuals).png",
          href:'#/i/all'
        }
      ]
  },
  // admins
  {
    title:'Admins',
    src: "img/Icons/Admins.png",
    nest:true,
    sub:
      [
        {
          title:'Add new',
          src: "img/Icons/AddNew.png",
          href:'#/admins/new'
        },
        {
          title:'Manage all',
          src: "img/Icons/ManageAll(Admins).png",
          href:'#/admins/all'
        }
      ]
  },
  // agreements
  {
    title:'Agreements',
    src: "img/Icons/Agreements.png",
    nest:true,
    sub:
      [
        {
          title:'All Agreements',
          src: "img/Icons/Agreements.png",
          href:'#/agreements/all'
        },
	    {
          title:'Manage Boiler Plates',
          src: "",
          href:'#/agreements/bp'
        },

        {
          title:'Manage Snippets',
          href:'#/agreements/snippets'
        },
      ]
  },
  // cases
  {
    title:'Mediations and Cases',
    src: "img/Icons/MediationsAndCases.png",
    nest:true,
    sub:
      [
        {
          title:'All Cases',
          src: "img/Icons/AllCases.png",
          href:'#/cases/all'
        },
        {
          title:'All Mediation Sessions',
          src: "img/Icons/AllSessions.png",
          href:'#/sessions/all'
        }
      ]
  },
  // Payments
  {
    title:'Payments',
    src: "img/Icons/Payments.png",
    nest:true,
    sub:
      [
        {
          title:'Credits Cost map',
          src: "img/Icons/CreditsCostMap.png",
          href:'#/credits/mapper'
        },
        {
          title:'Manage Plans',
          src: "img/Icons/ManagePlans.png",
          href:'#/plans/all'
        },
        {
          title:'Inward Payments',
          src: "img/Icons/InwardPayments.png",
          href:'#/payments/in'
        },
        {
          title:'Outward Accounts',
          src: "img/Icons/OutwardAccounts.png",
          href:'#/payments/out'
        }
      ]
  },
  ]);
});
bravAdmin.service('sharedProperties', function () {
  var bpdet = {};
  var a=[];
  return {
      setDetails: function(bp) {
                bpdet = bp;
      },


      getDetails: function () {
                return bpdet;
      },

     removeTag: function($index,tagsArray) {
        tagsArray.splice($index,1)[0];
        return tagsArray;
    },

     insertTag: function(tag,tagsArray) {

        tagsArray.push(tag);
        console.log("inside sharedProperties-> tagsArray: ",tagsArray);
        return tagsArray;

  }

  };

});

bravAdmin.service('apicalls',function ($http,bravAuthData) {
  this.getAdminProfile = function (next) {
    console.log("calling /app/getApi function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/api/admin/profile",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      console.log(response);
      if(response.ok ){
        next(response.data);
      }else{
        alert("failed to fetch data");
        //  bravAuthData.clearAuth();
        //  window.location = '/#/login';
      }
    });
  };

  this.adminProfile = function(callback){
    console.log("calling /a/profile function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/profile",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      if(response.ok ){
        callback(response.data);
      }
      else{
        alert("Failed to fetch data");
      }

    });
  };

  this.getAllMediators = function(callback){
    console.log("calling /a/api/m/all function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/m/all",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      if(response.ok ){
        callback(response.data);
      }
      else{
        alert("Failed to fetch data");
      }

    });
  };

this.getAllOrg = function(callback){
    console.log("calling /a/api/org/all function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/o/all",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      if(response.ok ){
        callback(response.data);
      }
      else{
        alert("Failed to fetch data");
      }

    });
  };
  this.getAllInd = function(callback){
    console.log("calling /a/api/ind/all function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/i/all",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      if(response.ok ){
        callback(response.data);
      }
      else{
        alert("Failed to fetch data");
      }

    });
  };

this.getAllAdmin = function(callback){
    console.log("calling /a/api/admin/all function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/admins/all",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      if(response.ok ){
        callback(response.data);
      }
      else{
        alert("Failed to fetch data");
      }

    });
  };


  this.medApproval = function(req, callback){
    console.log("Req",req);
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/m/accept",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
      callback(response);
    });
  };

  this.revokeApproval = function(req, callback){
    console.log("Req",req);
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/m/revoke",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
      callback(response);
    });
  };

  this.makePro = function(req, callback){
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/m/makePro",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
      callback(response);
    });
  };

  this.revokePro = function(req, callback){
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/api/m/revokePro",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
      callback(response);
    });
  };

  this.saveBpDetails = function (req,callback) {
    console.log("inside apicall saveEditedAgreement");
    console.log("Req",req);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerPlate/update",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
		  callback(response);
    });
  };

  this.saveboilerplates = function (req,callback) {
    console.log("inside apicall saveboilerplates");
    console.log("Req",req);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerPlate/save",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
		  callback(response);
    });
  };

  this.deleteBoilerPlate = function (req,callback) {
    console.log("inside apicall saveboilerplates");
    console.log("Req",req);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerPlate/delete",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({id: req})
    };

    $http(settings).success(function (response) {
      callback(response);
    });
  };

  let self = this;
  this.getBPContent = function (req) {
    console.log("inside apicall getBPContent");
    console.log("Req",req);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerPlate/one",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
       "params": {id:req}
    };

    $http(settings).success(function(res){
      if(res.ok){
            res.bp.editable= true;
            self.setBPstuff(res.bp);
            window.location = '#/agreements/bp';
      }
    });
  };

  currentBPstuff = false;
  this.setBPstuff = function(data) {
    currentBPstuff = data;
  };

  this.getBPStuff = function() {
    let objectToGiveBack =currentBPstuff ;
    currentAgreementStuff = false ;
    return objectToGiveBack;
  }

  this.getAllBoilerPlate= function(callback){
    console.log("calling /a/api/ind/all function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerPlate/all",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(function (response) {
      if(response.ok ){
        callback(response.data);
      }
      else{
        alert("Failed to fetch data");
      }

    });
  };

  this.finalizeboilerplates = function (req,callback) {
    console.log("inside apicall finalizeboilerplates");
    console.log("Req",req);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerPlate/finalize",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
      callback(response);
    });
  };

  this.addingsnippets = function (req,callback) {
    console.log("inside apicall adding snippets");
    console.log("Req",req);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/addSnippets",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(req)
    };

    $http(settings).success(function (response) {
		  callback(response);
    });
  };

  this.createBoilerPlate=function(boilerDetails,next){

    console.log("calling create boilerplate-bravadmin.module.js");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/boilerplate/create",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(boilerDetails)
    };
    $http(settings).success(next);// will execute next({ok:true,id:'887669kjnk'}) on success
  };



  this.createSnippet=function(snippets,next){

    console.log("calling createSnippet-bravadmin.module.js");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/admin/Snippet/create",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(snippets)
    };
    $http(settings).success(next);// will execute next({ok:true,id:'887669kjnk'}) on success
  };

});




























