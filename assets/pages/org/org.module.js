/**
 * Created by Omkar Dusane on 26-Oct-16.
 */
var bravOrg = angular.module('bravApp', [
  'ngRoute','bravApp.agreement','bravAuthModule','paymentModule','caseServices'
]).config(function ($routeProvider) {
  $routeProvider
    .when("/org", { // home page
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    });
});

bravOrg.service('orgApi',function ($http,bravAuthData) {
  console.log('orgApi Initialized')

});

bravOrg.controller('sidebarLinksCtrl',function (bravHomeApi) {
  /** Links here */
  var links = [
      // profile or Home
    {
      title:'Home',
      src: "img/Icons/Home.png",
      href: "#/",
      nest:false
    },
    // cases
    {
        title:'Brāv Sessions & Cases',
        src: "img/Icons/BravSessions&Cases.png",
        nest:true,
        sub:
          [
            {
            title:'Select Mediator/Brāv One to Create new Session',
            src: "img/Icons/NewSession.png",
            href:'#/ms/new'
          },
          {
            title:'All Mediation Sessions',
            src: "img/Icons/AllSessions.png",
            href:'#/ms/all'
          },
          {
            title:'New Case',
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
  ];
  console.log('sidebarLinksCtrl Loaded')
  bravHomeApi.setLinksList(links);
});
