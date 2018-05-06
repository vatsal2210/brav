angular
  .module('brav')
  .controller('mediatorController', mediatorController);

mediatorController.$inject = ['$scope', '$location'];

function mediatorController($scope, $location) {
  var MSC = this;

  MSC.isCameraOn = true;
  MSC.isInCall = false;
  MSC.isMicrophoneOn = true;
  MSC.isRecordOn = true;

  MSC.toggleButtonFn = toggleButtonFn;

  function toggleButtonFn(type) {
    if (type === 'camera') {
      MSC.isCameraOn = !MSC.isCameraOn;
      window.localStream.getVideoTracks()[0].enabled = !(window.localStream.getVideoTracks()[0].enabled);
    } else if (type === 'microphone') {
      MSC.isMicrophoneOn = !MSC.isMicrophoneOn;
      window.localStream.getAudioTracks()[0].enabled = !(window.localStream.getAudioTracks()[0].enabled);
    } else if (type === 'record') {
      MSC.isRecordOn = !MSC.isRecordOn;
    } else if (type === 'phone') {
      endCall();
    }
  }

  let peer = new Peer(id, {
    host: '/',
    port: 9000,
    path: '/api'
  });

  function handleCall(call, id) {
    placecall(call, id)
  }

  function placecall(call, index) {
    index = !index || index === 0 ? 1 : index;
    var _main = $('#clientvedios');
    if ($(_main).children().find('#vedio' + index).length == 0) {
      call.on('stream', function (remoteStream) {
        $('#call').hide();
        var _div = $('<div class="single-client-vedio" ></div>');
        var _vedio = $('<video id="vedio' + index + '" autoplay="true" width="100%" height="100%">');
        $(_vedio).prop('src', URL.createObjectURL(remoteStream));
        $(_main).append($(_div).append(_vedio));
        MSC.isInCall = true;
        window.existingCall = call;
        window.existingCallId = index;
      });
    }
  }

  function callPeer(id) {
    var call = peer.call(id, window.localStream);
    placecall(call, id);
  }

  function endCall() {
    var user = commonService.getSessionData();
    if (user) {
      if (window.existingCall) {
        window.existingCall.close();
        MSC.isInCall = false;
        $('#vedio' + window.existingCallId).parent().remove();
        var c = peer.connect(window.existingCallId, {
          label: 'drop',
          serialization: 'none',
          metadata: {
            name: user.firstname + ' ' + user.lastname
          }
        });
        c.on('open', function () {
          c.send('Call disconnected');
        });
      }
    } else {
      window.location = '/';
    }
  }

  var constraints = window.constraints = {
    audio: true,
    video: true
  };

  navigator
    .mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      window.localStream = stream;
      $('#my-video').prop('src', URL.createObjectURL(stream));
      peer.on('call', function (call) {
        swal("Do you want to accept call from " + call.peer, {
          buttons: {
            cancel: "Decline",
            accept: {
              text: "Accept",
              value: true,
            }
          }
        }).then(function (res) {
          if (res) {
            window.existingCall = call;
            call.answer(stream); // Answer the call with an A/V stream.
            handleCall(call, call.peer);
          }
        });
      });
    });




}
