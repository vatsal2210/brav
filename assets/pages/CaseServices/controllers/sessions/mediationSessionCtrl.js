caseServices.controller('mediationSessionCtrl', function($scope,sessionService,$rootScope,msApi,chatApi,$routeParams,bravAuthData,bravUI) {
  console.log('LOG : TEST SESSION CTRL LOADED ',$routeParams)
    /** Brav Server concerns */
    let remotes = document.getElementById('playlist'); // can be remotes
    let mainContainer = document.getElementById('main_container');
          
    let initialize = function(){
      
      let webrtc = sessionService.getRtc();
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
      window.onhashchange_array.push(function(){
        console.log('SESSION_CTRL hash change, newhash: ',location.hash);
        if(location.hash.length>=6 && window.lastHash.length >=6 )
        if(window.lastHash.substr(0,6) == '#/ms/s' && location.hash.substr(0,6) != '#/ms/s'){
          webrtc.leaveRoom();
          webrtc.stopLocalVideo();
          //webrtc.disconnect();
          //webrtc.connection.disconnect();
          console.log(" Disconnected ");
        }
      });

      $scope.chatApi = chatApi;
      chatApi.setSockets(function(message){
        webrtc.bravMessage({type:'DISCUSSION_ROOM_MESSAGE',payload:{room:'discussion',message:message,sender:bravAuthData.auth.email}}
          ,function(res){
            console.log('res of bravMessage : ',res);
        });
      });

      chatApi.setUser(bravAuthData.auth.email,'id_'+bravAuthData.auth.email);
      
      webrtc.on('readyToCall', function () {
        console.log('readyToCall exec')
        $scope.dynamics.ready = true ;
        $scope.$digest();
        $scope.startSession = function(){
            console.log('STARTSESSION clicked INNER');
            webrtc.joinRoom({name:$scope.stuff._id,token:bravAuthData.auth.token},function(res){
              console.log('Join Session Response : ',res);
              $scope.dynamics.started = true ;
              $scope.$digest();
            });
            webrtc.bravMessage(
              {
                ok:true,
                type:'SIGNAL',
                room:$scope.stuff._id,
                token:bravAuthData.auth.token
              },function(res){
                console.log('Text chat Join resp : ',res);
                //$mdSidenav('right').toggle();
                if(res.ok){
                  chatApi.addOldMessages(res.docs);
                  bravUI.showSimpleToast('You can also use text chat at the top right corner.')
                  $scope.toggleChatNav();
                  setTimeout(()=>{ chatApi.scrollDown() ;$scope.toggleChatNav(); },1200);
                }
            });
        };
      });

      webrtc.connection.on('brav_push', function (message) {
        console.log('heard from brav : ',message);
        if(message.ok){
          if(message.type == 'VIDEO'){
            //console.log('VIDEO Join Session Response : ',res);
            //$scope.dynamics.started = true; $scope.$digest();
          }else if(message.type == 'DISCUSSION_ROOM_MESSAGE'){
            chatApi.addToChat(message.payload.sender,message.payload.message,function(){
              $scope.$digest();
            });
            if(!$scope.isChatOpen()){
                bravUI.showTopToast('New Message!')
            }
          }
        }
      });

      $scope.endSession = function(){
        
        mainContainer.innerHTML ="";
        //webrtc.leaveRoom();
        //webrtc.disconnect();
        //webrtc = new SimpleWebRTC(rtcConfig);
        $scope.dynamics.ended = true;
        $scope.dynamics.started = false; 
        //$scope.$digest();
        window.location = "#/ms/all"

      };

      $scope.reloadNowToGetMediaAccess = function(){
        msApi.openMediationSession();
      };

      webrtc.on('videoAdded', function (video, peer) {
        console.log('video added', peer.nick);
        if (remotes && mainContainer) {
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
          if(mainContainer.childElementCount ==0){
            container.onclick();
          }
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
                    remotes.chil
                    remotes.removeChild(container);
                    if(mainContainer.childElementCount!=0){
                      if(mainContainer.children[0].id == 'container2_'+webrtc.getDomId(peer)){
                        mainContainer.innerHTML = "";
                        if(remotes.childElementCount != 0){
                          remotes.children[remotes.childElementCount].onclick();
                        }
                      }
                    }
                  };
                  console.log('iceConnectionStateChange Event : '+peer.pc.iceConnectionState," event : ",event);
                  if(
                      (peer.pc.iceConnectionState == 'disconnected')||
                      (peer.pc.iceConnectionState == 'failed')||
                      (peer.pc.iceConnectionState == 'closed')
                    ){
                      removeThisOne();
                    }
                  /*
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
                  }*/
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
    }
    /** RTC and conf helpers */
    if($routeParams.join){
      console.log('Setting ROuteparam MAn ', $routeParams.join)
      msApi.setSessionRequestId($routeParams.join);
      window.onhashchange();
      msApi.loadMediationSession(function(session){
        $scope.stuff = msApi.getMediationSessionStuff() || {
          "_id": "standard_room_to_test",
        };
        
        $scope.sessionDetails = session.sessionObject;
        $scope.sessionDetails.id = session._id;
        $scope.sessionDetails.createdAt = humanReadableDate(session.createdAt);//dummy field
        $scope.sessionDetails.payment = ''+(session.costs.total/100)+' USD';//dummy field       
        $scope.sessionDetails.individuals = session.individuals;
        $scope.sessionDetails.mediators = session.mediators;
        $scope.sessionDetails.schedule = session.schedule;
        if(session.schedule)
        {
          $scope.sessionDetails.schedule.str = new Date(session.schedule.epoch).toString();
          $scope.sessionDetails.schedule.future = (new Date().getTime() < session.schedule.epoch) ;
          $scope.sessionDetails.schedule.fromNow = moment(new Date(session.schedule.epoch),"YYYYMMDD").fromNow();
        }
        $scope.flags={
            session : session.sessionStatus ,    
            payment : session.payment.status ,    
        };
        $scope.sessionDetails.status = 'Session Started';
      
        console.log('Stuff Loaded: ',$scope.stuff);    
        initialize();
      });
    }else{
      window.location = "#/ms/all"
    }

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
        //console.log('Added head : ',head);
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
      scaleOnebyMail:function(mail){}
    }
    /** Commons */
    

});
