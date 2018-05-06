/**
 * Created by Omkar Dusane on 26-Oct-16.

 ChatSessionService

 */
var ObjectId = require('sails-mongo/node_modules/mongodb').ObjectID;

module.exports = {

  createSession : function (title,note,org_email_id,org_name,type,usersArray, date, time,tz, next) {
    /*  Users.native(function (er1, c) {
     console.log("inside users.find native");
     c.findOne({email:org_email_id},{name:1}).exec(function (er2 ,docs) {
     console.log("inside users.find");
     if(er2==null){
     next(true,docs)
     }else{
     next(false)
     }
     });
     })*/

    ChatSessions.native(function (er1, c) {
      c.insert({
        dateslot : date,
        timeslot: time,
        tz: tz,
        org : {name: org_name, email:org_email_id, type: type},
        //orgname: org_name,
        sesh: {title:title, note:note},
        users: usersArray,
        mediators: [],  // {email }
        status : 1 ,
        mediatorSignal : 0
      },function (er2, rslt2) {
        if(er2==null){
          var cdate = new Date(date);
          cdate = cdate.toLocaleDateString("en-US");
          var seshDetails =' \n' +
            '\n Session Title: ' +title+
            '\n Session Description: ' +note+
            '\n Date and time :' +cdate+', '+time+', '+tz+
            '\n TimeZone of the session : '+tz+' (Please look for equivalent time at your native place according to this time : ' +
            '\n https://www.google.com/search?q=convert%20'+time+'%20'+tz+'in%20my%20local%20time ) '+
            '' +
            '\n';
          usersArray.forEach(function (onemail) {
            emailService.sendSessionEmailToUser(onemail.email,seshDetails,org_email_id,function (ok) {
              if(ok)
              {

              }
            });
          })
          next(true)
        }else{
          next(false)
        }
      });
    })
  },

  /* addMediator : function (m_email,csid) {
   ChatSessions.native(function (er1, c) {
   c.update({_id:new ObjectId(csid)},{$addToSet:{mediators:{email:m_email,hasJoined:false,hasLeft:false}}},function (er2, nModified ,rslt2) {
   if(er2==null && nModified ==1){
   next(true)
   }else{
   next(false)
   }
   });
   })
   },*/

  modifySessionStatus: function (q,intS,next) {
    ChatSessions.native(function (er1, c) {
      c.update(q,{$set:{status:intS}},function (er2, nModified ,rslt2) {
        if(er2==null && nModified ==1){
          next(true)
        }else{
          next(false)
        }
      });
    })
  },

  modifyMediatorSignal: function (q,intS,next) {
    ChatSessions.native(function (er1, c) {
      c.update(q,{$set:{mediatorSignal:intS}},function (er2, nModified ,rslt2) {
        if(er2==null && nModified ==1){
          next(true)
        }else{
          next(false)
        }
      });
    })
  },

  getAllForBravOnes : function (mmail,next) { // mmail is email of that mediator
    ChatSessions.native(function (er1, c) {
      userService.getMediatorInfo({email:mmail},function (ok, doc) {
        if(ok){
          if(doc.mediatorApproved ==true){

            c.find({'mediators.email':{$nin:[mmail]}},{sesh:1,dateslot:1,timeslot:1,tz:1,org:1,status:1,mediatorSignal:1,mediators:1}).toArray(function (er2 ,docs) {
              if(er2==null ){
                next(true,docs)
              }else{
                next(false)
              }
            });

          }else{
            next(false)
          }
        }else{
          next(false)
        }
      })
    })
  },

  getMySessionsForBravOnes : function (med_email,next) {
    ChatSessions.native(function (er1, c) {
      userService.getMediatorInfo({email:med_email},function (ok, doc) {
        if(ok){
          if(doc.mediatorApproved ==true){

            c.find({'mediators.email':med_email,},{sesh:1,dateslot:1,timeslot:1,tz:1,org:1,status:1,mediatorSignal:1,mediators:1}).toArray(function (er2 ,docs) {
              if(er2==null ){
                next(true,docs)
              }else{
                next(false)
              }
            });

          }else{
            next(false)
          }
        }else{
          next(false)
        }
      })

    })
  },

  getMySessionsForIndividuals : function (i_email,next) {
    ChatSessions.native(function (er1, c) {
      c.find({'users.email':i_email},{sesh:1,dateslot:1,timeslot:1,tz:1,org:1,status:1,mediatorSignal:1,users:1}).
      toArray(function (er2 ,docs) {
        if(er2==null ){
          var seshList = [];
          docs.forEach(function (doc) {
            var newdoc = doc ;
            doc.users.forEach(function (userStatus) {
              if(userStatus.email == i_email)
              {
                newdoc.userKaStatus = userStatus;
              }
            });
            seshList.push(newdoc);
          });
          next(true,seshList)
        }else{
          next(false)
        }
      });
    })
  },

  getAllByOrg : function (orgemail,next) {
    ChatSessions.native(function (er1, c) {
      c.find({org:orgemail},{sesh:1,dateslot:1,timeslot:1,tz:1,org:1,users:1,status:1,mediatorSignal:1})
        .toArray(function (er2 ,docs) {
        if(er2==null){
          next(true,docs)
        }else{
          next(false)
        }
      });
    })
  },

  acceptSessionM : function (m_mail,csid,next) {
    var obj = {
      email:m_mail,
      hasJoined:false,hasLeft:false,
      willJoin:true,hasDenied:false
    };

    ChatSessions.native(function (er1, c) {

      c.update({_id:new ObjectId(csid)},
        {$push:{mediators:obj}},function (er2, rslt2) {
          if(er2==null && rslt2.result.nModified == 1 ){
            ChatSessionService.modifyMediatorSignal({_id:new ObjectId(csid),mediatorSignal:0},1,function () {
              // mediator signal may be updated depending on previous people joining it so no Sync Next()
            }); // to update mediator signal
            next(true);
          }else{
            next(false)
          }
        });
    })
  },

  acceptSessionAgainM : function (m_mail,csid,next) {
    var obj = {
      email:m_mail,
      hasJoined:false,hasLeft:false,
      willJoin:true,hasDenied:false
    };
    ChatSessions.native(function (er1, c) {

      c.update({_id:new ObjectId(csid),'mediators.email':m_mail},
        {$set:{'mediators.$':obj}},function (er2, rslt2) {
          if(er2==null && rslt2.result.nModified == 1 ){
            ChatSessionService.modifyMediatorSignal({_id:new ObjectId(csid),mediatorSignal:0},1,function () {
              // mediator signal may be updated depending on previous people joining it so no Sync Next()
            }); // to update mediator signal
            next(true);
          }else{
            next(false)
          }
        });
    })
  },

  acceptSessionI : function (i_mail,csid,next) {
    /*
     Original
     {
     hasJoined:false,hasLeft:false,
     willJoin:false,hasDenied:false
     };
     */
    ChatSessions.native(function (er1, c) {
      c.update({_id:new ObjectId(csid),'users.email':i_mail},{$set:{'users.$.willJoin':true}},function (er2, rslt2) {
        if(er2==null && rslt2.result.nModified ==1){
          next(true)
        }else{
          next(false)
        }
      });
    })
  },

  denySessionM : function (m_mail, csid,next) {
    var obj = {
      email:m_mail,
      hasJoined:false,hasLeft:false,
      willJoin:false,hasDenied:true
    };

    ChatSessions.native(function (er1, c) {
      c.update({_id:new ObjectId(csid),'mediators.email':m_mail},{$set:{'mediators.$':obj}},function (er2, rslt2) {
        if(er2==null && rslt2.result.nModified ==1){
          next(true)
        }else{
          next(false)
        }
      });
    })
  },

  denySessionI : function (i_mail, csid,next) {

    // initial state : willjoin
    // final state : hasDenied

    ChatSessions.native(function (er1, c) {
      c.update({_id:new ObjectId(csid),'users.email':i_mail},{$set:{'users.$.hasDenied':true,'users.$.willJoin':false}},function (er2 ,rslt2) {
        if(er2==null && rslt2.result.nModified ==1){
          next(true)
        }else{
          next(false)
        }
      });
    })
  },

  // when mediator jumps into a video chat
  joinSessionM : function () {

  },

  // when mediator leaves video chat
  leaveSessionM : function (m_mail,csid) {

  },

  // when individual jumps into a video chat
  joinSessionI : function () {

  },

  // individual leaves the video chat
  leaveSessionI : function (i_mail,csid) {

  },

};
