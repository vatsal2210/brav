

module.exports.routes = {


  /************ Single page app home ************/
  'GET /app/home': 'AppController.appHome',

  /* for routing to 4 apps */
  'POST /application':'AppController.application',
  'GET /application':'AppController.applicationGet',
  'GET /socketter':'SocketManagerController.socketter',

  /** USER MANAGEMENT START */
  'GET /user/signout': 'UserController.signOut',
  'POST /user/signup': 'UserController.signUp',
  'POST /user/signin': 'UserController.signIn',
  'POST /user/verify': 'UserController.verifyOTP',
  'POST /user/recover/getotp': 'UserController.forgotPassword',
  'POST /user/recover/verify': 'UserController.verifyAfterPasswordRecovery',

  /** USER MANAGEMENT END */

  /************** API v 0.1 start *************** */
  /******************API BravAdmin START*********************/

/*
  'GET /api/admin/profile' :'BravAdminController.getAdminProfile' ,
  'GET /api/orgs/all' :'BravAdminController.getAllOrgs' ,
  'GET /api/i/all' :'BravAdminController.getAllUsers' ,

  'GET /api/mediator/all' :'BravAdminController.getAllMediators' ,
  'GET /api/mediator/sample':'BravAdminController.sample' ,
  'POST /api/mediator/approve': 'BravAdminController.approveMediator' ,
  'POST /api/mediator/revoke': 'BravAdminController.revokeMediator' ,
*/

  /*******************API BravAdmin END*********************/
  /*******************API v 0.1 end************** */
  /*******************API v 0.2 start************** */

  // PLANS AND PAYMENT
/*
  'POST /plans': 'PlansController.getAllPlans',
  'POST /plans/active': 'PlansController.getMyPlans',
  'POST /plans/subscribe': 'PlansController.initiatePlanTransaction',

  'POST /plans/addplan': 'PlansController.addplan',
  'POST /plans/getplans': 'PlansController.getplans',
  'POST /plans/editplan': 'PlansController.editplan',
  'POST /plans/buyplans': 'PlansController.buyplan',
  'POST /payment/checkout': 'PlansController.stripeCharge',
  //'POST /plans/deleteplan': 'PlansController.deleteplan',
*/

  /******************* API v0.2 end ********************/
  /******************* API v0.3 start ********************/

  // ADMINS SPECIFIC
  'GET /a/api/m/all' : 'BravAdminController.getAllMediators',
  'GET /a/profile' : 'BravAdminController.getAdminProfile',
  'POST /a/api/m/accept' : 'BravAdminController.medApproval',
  'POST /a/api/m/revoke' : 'BravAdminController.revokeApproval',
  'POST /a/api/m/makePro' : 'BravAdminController.makeMediatorPro',
  'POST /a/api/m/revokePro' : 'BravAdminController.revokeMediatorPro',

  'GET  /a/api/o/all' : 'BravAdminController.getAllOrgs',

  'GET  /a/api/i/all' : 'BravAdminController.getAllIndividuals',

  'GET  /a/api/admins/all' : 'BravAdminController.getAllAdmins',

  'POST  /admin/boilerplate/create' : 'BravAdminController.createBoilerPlate',
  'POST  /admin/boilerPlate/save' : 'BravAdminController.saveBoilerPlate',
  'POST  /admin/boilerPlate/delete' : 'BravAdminController.deleteBoilerPlate',
  'POST  /admin/boilerPlate/update' : 'BravAdminController.updateBoilerPlate',
  'POST /admin/boilerPlate/finalize' : 'BravAdminController.finalizeBoilerPlate',
  'GET  /admin/boilerPlate/all' : 'BravAdminController.getAllBoilerPlate',
  'GET /admin/boilerPlate/one' : 'BravAdminController.getOneBoilerPlate',

  'POST /admin/Snippet/create' : 'BravAdminController.createSnippet',

  // INDIVIDUALS
  'GET /i/api/profile' : 'IndividualController.getProfile' ,

  // ORGANIZATIONS

  // MEDIATORS
  'GET /m/api/profile' :'MediatorController.getMyProfile' ,
  'POST /m/api/profile':'MediatorController.addToMyProfile', // API: READY , VIEWS :

  /** M acting as MO or M */
  'POST /m/api/mo/create' :'MediatorController.createMediatorOrganization' ,// API: READY , VIEWS :
  'POST /m/api/mo/checkMember' : 'MediatorController.checkMemberValidity',
  'GET /m/api/mo/getall' :'MediatorController.getMyMediationCompany' ,// API: READY , VIEWS :
  'POST /m/api/mo/respond' :'MediatorController.respondToMediaionOrganizationJoinRequest' ,// API: READY , VIEWS :
  
  /** MediatorOrgs  */
  'GET /mo/api/getCompProfile' : 'MediatorsOrgController.getOneCompProile',
  'GET /a/profile/getMyOrgList' : 'MediatorsOrgController.getMediationCompanyList',
  'GET /mo/api/publicprofile':'MediatorsOrgController.getPublicProfileByName',// API: READY , VIEWS :
  'GET /mo/api/profile':'MediatorsOrgController.getProfileByName',// API: READY , VIEWS :
  'POST /mo/api/invite':'MediatorsOrgController.inviteToOrg',// API: READY , VIEWS :
  'POST /mo/api/remove':'MediatorsOrgController.removeFromOrg',// API: READY , VIEWS :
  'POST /mo/api/leave':'MediatorsOrgController.leaveOrg',// API: READY , VIEWS :

  /* Common APIs */
  /** Utils */
  //'GET /utils/ms/prices':'UtilsController.getCurrentPricesForMediationSession', // API: READY , VIEWS : ?
  'GET /utils/timezones':'UtilsController.getAvailableTimeZones', // API: READY , VIEWS : ?

  /** cases */
  'POST /common/api/case/create':'CaseController.createCase', 
  'POST /common/api/case/modify':'CaseController.modifyCase',
  'POST /common/api/case/status':'CaseController.updateCaseStatus',
  'GET /common/api/case/getAll':'CaseController.getAllCases', 

  /** mediation sessions */
  'GET /common/api/m/all':'CaseController.getMediatorProfiles', 
  'GET /common/api/m/one':'CaseController.getMediatorProfile', 

  'POST /common/api/ms/create':'CaseController.createMediationSession',
  'GET /common/api/ms/all':'CaseController.getAllMediationSessions',
  'GET /common/api/ms/requests':'CaseController.getAllMediationSessionRequests', 
  'GET /common/api/ms/request/one':'CaseController.getOneMediationSessionRequest',
  'POST /common/api/ms/respond':'CaseController.respondToMediationRequest',
  'POST /common/api/ms/act':'CaseController.actionsToMediationRequest', 
  'POST /common/api/ms/pay':'CaseController.payNow', 

  /** agreements */

  'GET /common/api/agreement/helpers':'AgreementsController.getHelperData',
  'GET /common/api/agreement/boilerplate':'AgreementsController.getBoilerPlate',

  'POST /common/api/agreement/create':'AgreementsController.create',
  'POST /common/api/agreement/update':'AgreementsController.update',
  'POST /common/api/agreement/save':'AgreementsController.saveContent',
  'GET /common/api/agreement/content':'AgreementsController.getLastSavedContent',

  'GET /common/api/agreement/drafts':'AgreementsController.getAllDraftAgreements',
  'GET /common/api/agreement/drafts/shared':'AgreementsController.getAllSharedDraftAgreements',
  'GET /common/api/agreement/requests':'AgreementsController.getAllAgreementSigningRequests',
  'GET /common/api/agreement/signed':'AgreementsController.getAllSignedAgreements',

  'GET /common/api/agreement/one':'AgreementsController.getOneAgreement',

  'POST /common/api/agreement/finalize':'AgreementsController.finalize',
  'POST /common/api/agreement/sign':'AgreementsController.sign',

  'POST /common/api/agreement/pdf':'AgreementsController.generatePdf',


  /********************* API v0.3 end *********************/

  /*'/': {
    view: 'main.html'
  },*/

  /*'/login': {
    view: 'login'
  },
  '/reg': {
    view: 'reg'
  },
  */


  //Update : Vatsal : 2018-05-05 - Route Files from Br-master
  '/': {
    controller: 'UserController',
    action: 'loginpage'
  },
  '/register': {
    controller: 'UserController',
    action: 'registerpage'
  },
  '/profile': {
    controller: 'UserController',
    action: 'profilepage'
  },
  '/schedule': {
    controller: 'ScheduleController',
    action: 'schedulepage'
  },
  '/schedule/done': {
    controller: 'ScheduleController',
    action: 'thankpage'
  },
  '/task': {
    controller: 'TaskController',
    action: 'taskpage'
  },
  '/note/create': {
    controller: 'NoteController',
    action: 'notepage'
  },
  '/note/view': {
    controller: 'NoteController',
    action: 'viewnote'
  },
  '/mediator/:id': {
    controller: 'MediatorController',
    action: 'index',
    skipAssets: true
  },

};
