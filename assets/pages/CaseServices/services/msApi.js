caseServices.service('msApi',function($http,bravAuthData) {

  this.requestId = false;
  this.sessionStuff = false;

  /*
    this.dynamics ={};
    let stuff = false;
    


    this.setSessionDynamics = function(dynamics){
      window.localStorage.setItem('sessionDynamics',JSON.stringify(dynamics));
      this.dynamics = dynamics;
    }

    this.getSessionDynamics = function(){
      if(this.dynamics==false)
      {
        if(window.localStorage.getItem('sessionDynamics')!=null){
            console.log('dynamics found in ls');
            this.dynamics = JSON.parse(window.localStorage.getItem('sessionDynamics'));
        }
      }
      return this.dynamics;
    }
    
    this.eraseSessionDynamics = function(){
      window.localStorage.removeItem('sessionDynamics');
      this.dynamics = false;
    }
  */

  this.setSessionRequestId = function(id) {
    console.log('setting requestId')
    this.requestId = id;
  }

  this.getSessionRequestId = function() {
    console.log('Getting requestId : '+this.requestId) 
    return this.requestId ;
  }
  
  this.setMediationSessionStuff = function(data) {
    this.sessionStuff = data;
  }

  this.getMediationSessionStuff = function() {
    return this.sessionStuff;
  }
  /** Local InterController Communication */
  var draftSessionData = {
    mediatorsArray:[],
    sessionsArray: []
  };

  this.getMediatorArray = function (){
    return draftSessionData.mediatorsArray ;
  };
  this.setMediatorArray = function (array){
     draftSessionData.mediatorsArray = array;
  };

  this.setSessionsLocal = function(array) {
    draftSessionData.sessionsArray = array;
  };
  this.addToSessionsLocal = function(obj) {
    draftSessionData.sessionsArray.push(obj);
  };
  this.getSessionsLocal = function() {
    return draftSessionData.sessionsArray;
  };

  /** End of InterController Communication */

  this.getOneMediationSessionRequest = function(next){
    if(this.requestId == false){
      window.location = "#/ms/requests";
    }else{
      let settings = {
        "async": true,
        "crossDomain": true,
          "url": "/common/api/ms/request/one",
          "method": "GET",
          "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "x-access-token": bravAuthData.auth.token
          },
          "params": {id:this.requestId},
      }
      $http(settings).success(next);
    }
  };

  this.openMediationSession = function(){
    let self = this;
    this.getOneMediationSessionRequest(function(res){
      if(res.ok){
        self.setMediationSessionStuff(res.session);
        //window.location = "/ms/s";
        let loc = window.location.protocol+"//"+window.location.host+'/application#/ms/s?join='+self.getSessionRequestId();
        window.location = loc ; 
        window.location.reload() 
      }
    });
  }

  this.loadMediationSession = function(next){
    let self = this;
    this.getOneMediationSessionRequest(function(res){
      if(res.ok){
        self.setMediationSessionStuff(res.session);
        next(res.session);
      }
    });
  }

  /** Sessions API in v3.0*/
  this.getAllMediators = function(next){
    var settings = {
      "async": true,
      "crossDomain": true,
        "url": "/common/api/m/all",
        "method": "GET",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "x-access-token": bravAuthData.auth.token
        },
        "data":"",
      }
      $http(settings).success(next);
  };

  this.createMediationSession = function (sessionObject,next){
    // if(this.getMediatorArray().length == 0){
    //   next({ok:false,message:'please select atleast one mediator to create a session'});
    //   return ;
    // }
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/common/api/ms/create",
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

  this.getAllSessions = function(next){
    var settings = {
      "async": true,
      "crossDomain": true,
        "url": "/common/api/ms/all",
        "method": "GET",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "x-access-token": bravAuthData.auth.token
        },
        "data":"",
      }
      $http(settings).success(next);
  };

  this.getAllRequests = function(next){
    var settings = {
      "async": true,
      "crossDomain": true,
        "url": "/common/api/ms/requests",
        "method": "GET",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "x-access-token": bravAuthData.auth.token
        },
        "params":"",
      }
      $http(settings).success(next);
      /**
       * sample response :  same for getAllSessions
       * {
          "ok": true,
          "message": "here are the sessions",
          "sessions": [
            {
              "_id": "58a337856dbdcee409b97259",
              "sessionObject": {
                "description": "jhkdcb dckljsd ljv.sk dvlnsd; vkj sdkv.m dsvkjl",
                "caseTitle": "case1.title",
                "hours": "10",
                "title": "Sample Session for i1 and i2"
              },
              "individuals": [
                {
                  "email": "i2@i.i",
                  "accepted": true
                },
                {
                  "email": "i1@i.i",
                  "accepted": false
                }
              ],
              "mediators": [
                {
                  "id": "58138fdbd0ef0c3c169cb774",
                  "accepted": false
                }
              ],
              "payment": {
                "status": 21
              },
              "sessionStatus": 11,
              "schedule": false
            }
          ]
        }
        */
  };

  this.actionsToRequest = function(id,action,data,next){
    var settings = {
      "async": true,
      "crossDomain": true,
        "url": "/common/api/ms/act",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "x-access-token": bravAuthData.auth.token
        },
        "data":bodyparser({
          id:id, action:action ,data:data
        }),
      }
      $http(settings).success(next);
  };

  this.respondToRequest = function(id,accept,next){
    var settings = {
      "async": true,
      "crossDomain": true,
        "url": "/common/api/ms/respond",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
          "x-access-token": bravAuthData.auth.token
        },
        "data":bodyparser({
          id:id, accept:accept
        }),
      }
      $http(settings).success(next);
  };

  this.isMediator = function(){
    return (bravAuthData.auth.type==2);
  }

  this.isOrg = function(){
    return (bravAuthData.auth.type==3);
  }
  
  this.myEmail = function(){
    return (bravAuthData.auth.email);
  }

});

caseServices.service('sessionService',function($http,bravAuthData,bravConfig){
  this.webrtc = false ;
  const rtcConfig = {
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    nick: {name:'NameOf_'+bravAuthData.auth.email,mail:bravAuthData.auth.email},
    url: window.location.protocol+"//"+window.location.hostname+':'+bravConfig.getPortForSignallingServer()
  };
  this.initRtc = function(){
    if(!this.webrtc){
      this.webrtc = new SimpleWebRTC(rtcConfig);
    }
  };
  this.getRtc = function(){
    if(!this.webrtc){
      console.log('Giving new rtc')
      this.webrtc = new SimpleWebRTC(rtcConfig);
    }else{
      console.log('Giving old rtc')
      //delete this.webrtc;
      //this.webrtc = new SimpleWebRTC(rtcConfig);
      this.webrtc.testReadiness();
    }
    return this.webrtc;
  };
  this.renewRtc = function(){
    this.webrtc = new SimpleWebRTC(rtcConfig);
    return this.webrtc;
  }

})
