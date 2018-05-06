var bravOnes = angular.module('bravApp', [
  'ngRoute','bravApp.agreement','bravAuthModule','paymentModule', 'caseServices'
]).config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("/mc/create",{
      templateUrl : 'pages/BravOnes/html/create.html',
      controller :'ManageCompanyCtrl'
    })
    .when("/mc/view",{
      templateUrl: 'pages/BravOnes/html/view.html',
      controller : 'ManageCompanyCtrl'
    })
    .when("/mc/compProfile",{
      templateUrl: 'pages/BravOnes/html/companyProfile.html',
      controller : 'CompanyDataCtrl'
    })
    .when("/myorglist",{
      templateUrl: 'pages/BravOnes/html/myorg.html',
      controller : 'MyOrgCtrl'
    })
    .when("/profile", {
      templateUrl: 'pages/BravOnes/html/account.html',
      controller: 'accountMCtrl'
    });
});

bravOnes.directive("limitTo", [function() {
    return {
            restrict: "A",
            link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
            if (this.value.length == limit)
                 e.preventDefault();
            });
        }
    }
}]);

bravOnes.service('CompanyProfileProperties', function () {
  var compdet = {};
  var email="";
  return {
      setDetails: function(det) {
                compdet = det;
      },


      getDetails: function () {
                return compdet;
      }
  };

});

bravOnes.service('mApi',function ($http,bravAuthData,$httpParamSerializerJQLike) {

  this.getProfile = function (next) {
    console.log("calling getProfile");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/m/api/profile",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      paramSerializer: '$httpParamSerializerJQLike',
      "params":"" // get
    };
    $http(settings).success(next);
  };

   this.getMyOrgList = function(next){
    console.log("calling getMyOrgList");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/a/profile/getMyOrgList",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({})
    };
    $http(settings).success(next);
  };

  this.saveProfile = function (profile,next) {
    console.log("calling save profile toparse real ",profile);
    console.log("calling save profile toparse paramserial ",$httpParamSerializerJQLike(profile));
    console.log("calling save profile toparse bodyparser ",bodyparser(profile));
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/m/api/profile",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      //"data": $.param(profile)
      "data": $httpParamSerializerJQLike(profile)
      //"data": bodyparser(profile)
    };
    $http(settings).success(next);
  };

this.getAllOrgList= function(callback){
    console.log("calling /m/api/mo/getall function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/m/api/mo/getall",
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
  this.createCompany = function(data,next){
    console.log("calling create-bravOnes.module.js");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/m/api/mo/create",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser(data)
    };
    $http(settings).success(next);// will execute next({ok:true,id:'887669kjnk'}) on success
  };

this.getCompProfile = function(req,next){
    console.log("calling getCompProfile-bravOnes.module.js");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/mo/api/getCompProfile",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "params": {name :req}
    };
    $http(settings).success(next);// will execute next({ok:true,id:'887669kjnk'}) on success
  };
  this.checkMemberValidity = function(individual, next){
    console.log("calling checkMemberValidity-bravOnes.module.js");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/m/api/mo/checkMember",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": bodyparser({email: individual})
    };
    $http(settings).success(next);
  };

});

bravOnes.controller('sidebarLinksCtrl',function (bravHomeApi) {
  /** Links here */
  bravHomeApi.setLinksList([
      //profile
        {
          title:'Home',
          src: "img/Icons/Home.png",
          href: "#/",
          nest:false
        },
        {
          title:'Profile',
          src: 'img/Icons/Profile.png',
          href: "#/profile",
          nest:false
        },
        //Orgs
        {
          title:'Mediation Organizations',
          id:'mo',
          src: 'img/Icons/AllMediatorOrganizations.png',
          nest:true,
          disable:true,
          sub:
            [
              {
                title:'Create new',
                src: 'img/Icons/CreateNew.png',
                href:'#/mo/new'
              },
              {
                title:'My Organizations',
                src: 'img/Icons/MyOrganizations.png',
                href:'#/mo/all'
              }
            ]
        },
        // cases
        {
          title:'Brāv Sessions & Cases',
          src: "img/Icons/BravSessions&Cases.png",
          nest:true,
          sub:
            [
              {
                title:'New Session',
                src: "img/Icons/NewSession.png",
                href:'#/ms/new'
              },
              {
                title:'All Sessions',
                src: "img/Icons/AllSessions.png",
                href:'#/ms/all'
              },
              {
                title:'Session Requests',
                src: "img/Icons/SessionRequests.png",
                href:'#/ms/requests'
              },
              {
                title:'New case',
                src: "img/Icons/NewCase.png",
                href:'#/case/new'
              },
              {
                title:'All Cases',
                src: "img/Icons/AllCases.png",
                href:'#/case/all'
              }
            ]
        },

        //manage company
        {
          title:'Manage Company',
          src: 'img/Icons/ManageCompany.png',
          nest:true,
          disable:true,
          sub:
          [
            {
              title:'Create Company',
              src: 'img/Icons/CreateCompany.png',
              href:'#/mc/create'
            },
            {
              title:'View Company',
              src: 'img/Icons/ViewCompany.png',
              href:'#/mc/view'
            },
            {
              title:'Member Of',
              src: 'img/Icons/MemberOf.png',
              href:"#/myorglist",
            },
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
                title:'New',
                src: "img/Icons/New.png",
                href:'#/agreements/new'
              },
              {
                title:'My Drafts',
                src: "img/Icons/MyDrafts.png",
                href:'#/agreements/drafts'
              },
              {
                title:'Drafts Shared with me',
                src: "img/Icons/DraftsSharedWithMe.png",
                href:'#/agreements/drafts/shared'
              },
              {
                title:'Signing Requests',
                src: "img/Icons/SigningRequests.png",
                href:'#/agreements/requests'
              },
              {
                title:'Signed',
                src: "img/Icons/Signed.png",
                href:'#/agreements/signed'
              }
            ]
        },
        // Payments
        {
          title:'Payments',
          src: 'img/Icons/Payments.png',
          nest:true,
          disable:true,
          sub:
            [
              {
                title:'Buy a plan',
                src: 'img/Icons/BuyAPlan.png',
                href:'#/plans/buy'
              },
              {
                title:'Current Subscriptions',
                src: 'img/Icons/CurrentSubscriptions.png',
                href:'#/plans/current'
              }
            ]
        },
  ]);

});
