/**
 * Created by Omkar Dusane on 26-Oct-16.
 */

var iApp = angular.module('bravApp', [
  'ngRoute','bravApp.agreement','bravAuthModule','paymentModule', 'caseServices'
  ]).config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    })
    .when("/profile", { // cool view and editable profile
      templateUrl: 'pages/i/html/account.html',
      controller: 'accountICtrl'
    });

});

iApp.service('iApi',function ($http,bravAuthData) {

  this.getProfile = function (next) {
    console.log("calling i get profile");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/i/api/profile",
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
         window.location = '#';
      }
    });
  };

});

iApp.controller('sidebarLinksCtrl',function (bravHomeApi,tippyApi) {
  /** Links here */
  tippyApi.enableTippy();

  bravHomeApi.setLinksList([
      // profile
      {
      title:'Home',
      href: "#/",
      src: "img/Icons/Home.png",
      nest:false
      },
      // Mediation
      {
        title:'Brāv Sessions & Cases',
        src: "img/Icons/BravSessions&Cases.png",
        nest:true,
        sub:
          [
            {
              title:'Select Mediator/Brāv One to create new Session',
              src: "img/Icons/NewSession.png",
              href:'#/m/select'
            },
            {
              title:'My Sessions',
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
              title:'My cases',
              src: "img/Icons/AllCases.png",
              href:'#/case/all'
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
  ]);
});
