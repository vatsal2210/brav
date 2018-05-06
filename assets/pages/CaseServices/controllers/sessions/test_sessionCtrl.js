caseServices.controller('test_sessionCtrl', function($scope,sessionService,$rootScope,msApi,chatApi,$routeParams,bravAuthData) {
  console.log('LOG : TEST SESSION CTRL LOADED ',$routeParams)
    /** RTC and conf helpers */
    /*if($routeParams.join){
      console.log('Setting ROuteparam MAn ', $routeParams.join)
      msApi.getSessionRequestId($routeParams.join);
      window.onhashchange();
    }else{
      window.location = "#/ms/all"
    }*/
    let response = {
      "ok": true,
      "message": "here is the session request",
      "session": {
        "_id": "58c1caed5151fd2c20d2a26d",
        "createdAt": 1489095405972,
        "sessionObject": {
          "description": "kjnk lknkj",
          "hours": "7",
          "title": "Beda paar Hai",
          "case": {
            "_id": "58b6d757d98580c01cc6b9d7",
            "title": "Bullying of Mr  Harry"
          }
        },
        "schedule": {
          "epoch": 1489255200000
        }
      }
    };
    $scope.stuff = {
      // DUMMY_OBJECT
      "_id": "58c1caed5151fd2c20d2a26d",  
    };
    $scope.sessionDetails = response.session.sessionObject;
    $scope.sessionDetails.id = response.session._id;
    $scope.sessionDetails.createdAt = humanReadableDate(response.session.createdAt);//dummy field
    $scope.sessionDetails.individuals = response.session.individuals;
    $scope.sessionDetails.mediators = response.session.mediators;
    $scope.sessionDetails.schedule = response.session.schedule;
    if(response.session.schedule)
    {
      $scope.sessionDetails.schedule.str = new Date(response.session.schedule.epoch).toString();
      $scope.sessionDetails.schedule.fromNow = moment(new Date(response.session.schedule.epoch),"YYYYMMDD").fromNow();
    }
    $scope.sessionDetails.status = '';


    let mainVideoContainer = document.getElementById('mainVideoContainer');
    let heads ={
      all:[],
      add:function(name,mail,domId){
        let head = {
          email : mail ,
          domId : 'container_'+domId,
          name : name ,
          active : true
        };
        let found = false;
        heads.all.forEach(function(h){
          if(h.email == head.email){
            found = true;
            h = head ;
          }
        });
        if(!found){
          heads.all.push(head);
        }
        console.log('Added head : ',head);
      },
      get:function(mail){
        heads.all.forEach(function(h){
          if(h.email == mail){
            return h;
          }
        });
      },
      deactivate: function(mail){
        heads.all.forEach(function(h){
          if(h.email == mail){
            h.active =false;
          }
        });
      },
      scaleOne:function(mail){
        heads.all.forEach(function(h){
          if(h.email == mail){

          }else{

          }
        });
      }
    }
    let setMainVideo = function(video,connstate){
      mainVideoContainer.appendChild(video);
      mainVideoContainer.appendChild(connstate);
    }
    /** Commons */
    let webrtc = sessionService.getRtc();
    console.log('Log RTC ',webrtc)

    $scope.dynamics = {
      ready : false,
      started : false ,
      ended : false,
      audio : true,
      video : true,
      isMediator : (bravAuthData.auth.type==2),
      toggleVideo : function(){
        $scope.dynamics.video = !$scope.dynamics.video ;
        if($scope.dynamics.video){
          webrtc.resumeVideo();
        }else{
          webrtc.pauseVideo();
        }
      },
      toggleAudio : function(){
        $scope.dynamics.audio = !$scope.dynamics.audio ;
        if($scope.dynamics.audio){
          webrtc.unmute();
        }else{
          webrtc.mute();
        }
      },
    };
   
    /** Brav Server concerns */
    
    console.log('Stuff Loaded: ',$scope.stuff);
    $scope.chatApi = chatApi;
    chatApi.setSockets(function(message){
      webrtc.bravMessage({type:'DISCUSSION_ROOM_MESSAGE',payload:{room:'discussion',message:message,sender:bravAuthData.auth.email}}
        ,function(res){
          console.log('res of bravMessage : ',res);
      });
    });

    chatApi.setUser(bravAuthData.auth.email,'id_'+bravAuthData.auth.email);
    $scope.startSession = function(){
        console.log('STARTSESSION clicked OUTER ');
        webrtc.joinRoom({name:$scope.stuff._id,token:bravAuthData.auth.token},function(res){
          console.log('Join Session Response : ',res);
          $scope.dynamics.started = true ;$scope.$digest();
        });
    };

    webrtc.on('readyToCall', function () {
      console.log('readyToCall exec')
      $scope.dynamics.ready = true ;
      $scope.$digest();
      $scope.startSession = function(){
          console.log('STARTSESSION clicked INNER');
          webrtc.joinRoom({name:$scope.stuff._id,token:bravAuthData.auth.token},function(res){
            console.log('Join Session Response : ',res);
            $scope.dynamics.started = true ;$scope.$digest();
          });
      };
    });

    webrtc.bravMessage({ok:true,type:'SIGNAL'},function(res){
      console.log('res of SIGNAL : ',res);
    });

    webrtc.connection.on('brav_push', function (message) {
      console.log('heard from brav : ',message);
      if(message.ok){
        if(message.type == 'VIDEO'){
           console.log('VIDEO Join Session Response : ',res);
           $scope.dynamics.started = true; $scope.$digest();
        }else if(message.type == 'DISCUSSION_ROOM_MESSAGE'){
           console.log('in DISCUSSION ROOM MSG')
           chatApi.addToChat(message.payload.sender,message.payload.message,function(){
             $scope.$digest();
           });
        }
      }
    });

    $scope.endSession = function(){
      webrtc.leaveRoom();
      //webrtc.disconnect();
      //webrtc = new SimpleWebRTC(rtcConfig);
      $scope.dynamics.ended = true;
      $scope.dynamics.started = false; 
      //$scope.$digest();
    };

    $scope.reloadNowToGetMediaAccess = function(){
      msApi.openMediationSession();
    };
    
    webrtc.on('videoAdded', function (video, peer) {
        console.log('video added', peer.nick);
            
        var remotes = document.getElementById('playlist'); // can be remotes
        let mainContainer = document.getElementById('main_container');

        if (remotes && mainContainer) {
            
            console.log('in remotes ',video," ");
            var container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + webrtc.getDomId(peer);
            container.appendChild(video);
            // suppress contextmenu
            video.oncontextmenu = function () { return false; };

            container.onclick2 = function(){
              console.log('on click thisone')
            }
            container.onclick = function(){
              mainContainer.innerHTML = "";
              var container2 = document.createElement('div');
              container2.className = 'bigVideo';
              container2.id = 'container2_' + webrtc.getDomId(peer);
              var video2 = attachMediaStream(peer.stream);
              container2.appendChild(video2);
              mainContainer.appendChild(container2);
            }

            remotes.appendChild(container);
           // mainContainer.appendChild(container2);
              

            // show the ice connection state
            if (peer && peer.pc) {
                var connstate = document.createElement('div');
                connstate.className = 'connectionstate';
                container.appendChild(connstate);
                connstate.innerText = peer.nick.name;
                heads.add(peer.nick.name,peer.nick.mail,webrtc.getDomId(peer));
                
                peer.pc.on('iceConnectionStateChange', function (event) {
                    let removeThisOne = function(){
                      heads.deactivate(peer.nick.mail);
                      console.log('removing a peer : cause it ',peer.pc.iceConnectionState);
                      remotes.removeChild(container);
                    };
                    switch (peer.pc.iceConnectionState) {
                      case 'checking':
                          connstate.innerText += ': Connecting to peer...';
                          break;
                      case 'connected':
                          connstate.innerText += ': Connection established.';
                          break;
                      case 'completed': // on caller side
                          connstate.innerText += ': Connection established.';
                          break;
                      case 'disconnected':
                          connstate.innerText += ': Disconnected.';
                          removeThisOne();
                          break;
                      case 'failed':
                          connstate.innerText += ': Failed.';
                          removeThisOne();
                          break;
                      case 'closed':
                          connstate.innerText = 'Connection closed.';
                          //removeThisOne();
                          break;
                    }
                });
            }
        }
    });

    // a peer video was removed
    webrtc.on('videoRemoved', function (video, peer) {
        console.log('video removed ', peer);
        var remotes = document.getElementById('playlist');
        var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    //window.onhashchange = function(){
    window.onhashchange_array.push(function(){
      console.log('SESSION_CTRL hash change, newhash: ',location.hash)
      if(window.lastHash == '#/ms/s' && location.hash != '#/ms/s'){
         webrtc.leaveRoom();
         //webrtc.stopLocalVideo();
         //webrtc.disconnect();
         //webrtc.connection.disconnect();
         console.log(" Disconnected ");
      }
    });

});
