caseServices.service('chatApi', function($rootScope,$mdSidenav) {
  let currUser = {};
  this.setUser=function(name,id) {
    currUser.name = name;
    currUser.id = id;
  };
  this.emmitter = {};
  this.setSockets = function(em){
    this.emmitter = em;
  }
  this.selectedChat = 'Discussion';
  this.chats = [
    /*{
        groupName:'Omkar',
        private:true
    },*/

    /*{
        groupName:'Discussion',
        private:false,
        members : []
    }*/
  ];

  this.messages = [{
      senderName: 'Welcome',
      message: 'Lets start the discussion',
      time: 1231245674,
      self: true
    }
  ];

  this.user = {
    chatMessage: ''
  };
  
  this.scrollDown = function(){
      if(this.messages && this.messages.length >3){
        let list = document.getElementById("list_of_messages");
        //let targetId = "bottom_"+(this.messages.length-2);
        let targetId = "bottom";
        let targetLi = document.getElementById( targetId ); // id tag of the <li> element
        list.scrollTop = (targetLi.offsetTop);
      }
  }

  this.sendChat = function(e) {
    if(this.user.chatMessage.trim() !== '' && e.keyCode == 13) {
      this.messages.push({
        senderName: currUser.name,
        message: this.user.chatMessage,
        time: +Date.now(),
        self: true
      });
      this.emmitter(this.user.chatMessage);
      this.user.chatMessage = '';
      this.scrollDown();    
    }
  };

  this.addToChat = function(sender,message,next) {
      if(currUser.name != sender){
        this.messages.push({
          senderName: sender,
          message: message,
          time: +Date.now(),
          self: false
        });
        this.scrollDown();  
        next();          
      }
  };

  this.addOldMessages = function(list) {
    if(list.length == 0 ){
          this.messages =  [{
          senderName: 'Welcome',
          message: 'Lets start the discussion',
          time: 1231245674,
          self: true
        }
      ];
    }else{
      this.messages = [];
    }
    list.sort((function(k,l){if(k.ts>l.ts)return 1 ; else return -1}));
    list.forEach(item=>{
      this.messages.push({
        senderName: item.sender,
        message: item.message,
        time: item.ts,
        self: (currUser.name == item.sender)
      });          
    });
   
  };

  this.closeChat = function() {
    console.log("closeChat");
    //this.selectedChat = false;
    $mdSidenav('right').toggle();
  };

  this.hideChat = function() {
    $mdSidenav('right').toggle();
  };

  this.openChatGroup = function(name) {
    console.log(name);
    this.selectedChat = name;
    console.log(this.selectedChat);
   // $mdSidenav('right').toggle();
  };


});
