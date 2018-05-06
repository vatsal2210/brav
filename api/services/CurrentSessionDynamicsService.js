/**
 * Created by Omkar Dusane on 27-Feb-17.
 * 
 *  CurrentSessionDynamicsService
 * 
 */
"use strict"
let utils={
  doesThisArrayHaveThat:(thisArray,that)=>{
    for(let i=0;i<thisArray.length;i++){
        if( thisArray.indexOf(that) >= 0 ){
            return true;
            break;
        }
    }
    return false;
  },
  arrayEquality:(thisArray,thatArray)=>{
     if(thisArray.length != thatArray.length){
         return false;
     }
     for(let i=0;i<thatArray.length;i++){
        if (!privates.doesThisArrayHaveThat(thisArray,thatArray[i]))
        {
            return false;
        }
    }
    return true;
  },
  arrayEqualityBySort:(thisArray,thatArray)=>{
    thisArray.sort();
    thatArray.sort();
    for(let i=0;i<thisArray.length;i++){
        if( thatArray[i] != thatArray[i]) {
            return false;
            break;
        }
    }
    return true;
  }
}

let privates ={

  joinApproval:(sessionId,email,type,next)=>{
    let queryObject = {
        _id : uuidHelperService.makeObjectId(sessionId)
    };
    if(type == Users.flags.MEDIATOR){
        queryObject.mediators = {$elemMatch:{email:email,accepted:true}};
    }else if(type == Users.flags.INDIVIDUAL || type == Users.flags.ORG){
        queryObject.individuals = {$elemMatch:{email:email,accepted:true}};
    }
    MediationSession.native((er1, c)=>{
        if(er1!=null) {
            next({ok:false,message:'db error at level 1'})
            return;
        }
        c.find(queryObject).toArray((er2,docs)=>{
            if(er2!=null) {
                next({ok:false,message:'db error at level 2'})
                return;
            }
            if(docs.length == 1){
                let doc = docs[0];
                if(doc.sessionStatus >= MediationSession.flags.ENDED){
                    //console.log('session ended');
                    next({ok:false,message:'Session has already ended, Thanks. Please schedule next session in this series'});
                    return;
                }else if(doc.sessionStatus < MediationSession.flags.STARTED){
                    //console.log('session found creating the ticket')
                    // TODO : check session epoch
                    if(!!doc.schedule){
                        if(doc.schedule.epoch){
                            let onSchedule = true;
                            if(sails.config.constants.enableStrictTimeCheck)
                            {
                                onSchedule = ((doc.schedule.epoch-(5*60*1000)) <= TimeHelperService.getNow() );
                            }
                            if(onSchedule){
                                /** Working 
                                 *                         
                                 * 1. textChatrooms
                                 * 2. cocussingRooms
                                 * 3. mainRoom
                                 * *************************************
                                 *  1m 2i = 1 discussion + 2 chatrooms
                                 *  1m 3i = 1 discussion + 3 chatrooms
                                 *  2m 3i = 1 discussion + 3 chatrooms
                                 * *************************************
                                 *
                                 */
                                let updates={
                                    sessionStatus:MediationSession.flags.STARTED,
                                    'dynamics.startingTimeStamp':TimeHelperService.getNow()
                                };
                                privates.activateRoomsInCase(sessionObject,(activationResult)=>{
                                    if(activationResult.ok){
                                        // change status as STARTED
                                        c.update({_id:(doc._id)},
                                            {$set:updates},
                                            {upsert:fasle},
                                            (er2,updateResult)=>{
                                                if(!er2)
                                                {
                                                    next({ok:true,message:'You are the first one to join the session'});
                                                    //console.log('Join Session Successfull with ,nModified=',updateResult.result.nModified);
                                                }else{
                                                   next({ok:false,message:'could not update the session'});
                                                   //console.log('ERROR: Couldn\'t update after session was joined by first person: nModified=',updateResult.result.nModified);
                                                }
                                        });
                                        return;
                                    }else{
                                        next({ok:false,message:'Unable to activate chatrooms'});
                                    }
                                });
                            }else{
                                next({ok:false,message:'Sesison has not started yet,please wait or change the schedule'});
                                return;
                            }
                        }
                    }else{
                       next({ok:false,message:'This session needs to be scheduled'});
                       return;
                    }
                }else if(doc.sessionStatus == MediationSession.flags.STARTED){
                    //console.log('session started giving the tickets to other rooms')
                    next({ok:true,message:'session has started, Join now'});
                    return;
                }
            }else{
                //console.log('Session with such constraints not found');
                next({ok:false,message:'UnAuthorized to join the sesison.'});
                return;
            }
        });
    });
  },
  
  activateRoomsInCase:(sessionObject,next)=>{
    Cases.native((er1, c)=>{
        if(er1!=null) {
            next({ok:false,message:'db error at Cases level 1'})
            return;
        }
        c.find({id:uuidHelperService.makeObjectId(sessionObject.caseId)},
            (er2,docs)=>{
            if(er2!=null){
                next({ok:false,message:'Error level 2 in finding such case'})
            }
            if(docs.length==1){
                let updates = {};
                let currentCase = docs[0];
                if(currentCase.discussionRoom){
                    updates['discussionRoom.active']=true;
                    updates['discussionRoom.members']=members;
                    updates['discussionRoom.name']='Discussion';
                    sessionObject.individuals.forEach((individual)=>{
                        let room = {
                            members : [individual.email],
                        };
                        let correspondingPrivateRoom = false;
                        sessionObject.mediators.forEach((mediator)=>{
                            room.members.push(mediator.email);
                        });
                        currentCase.privateRooms.forEach((privateRoom)=>{
                            if(utils.arrayEqualityBySort(privateRoom.members,room.members)){
                                correspondingPrivateRoom = privateRoom ;
                            }
                        });
                        if(!correspondingPrivateRoom){
                            room.name = '('+individual.email+'): Private Room';
                            room.id= uuidHelperService.makePublicId();
                        }else{
                            updates['']                            
                        }
                        updates.privateRooms.push(room); 
                    });
                }else{
                    updates.privateRooms = [];
                    updates.discussionRoom = {
                        active:true,
                        members:members,
                        name:'Discussion',
                        id: uuidHelperService.makePublicId()
                    }
                    sessionObject.individuals.forEach((individual)=>{
                        let room ={
                            id: uuidHelperService.makePublicId(),
                            members :[individual.email],
                            name : '('+individual.email+'): Private Room'
                        };
                        sessionObject.mediators.forEach((mediator)=>{
                            room.members.push(mediator.email); 
                        });
                        room = room.sort();
                        updates.privateRooms.push(room); 
                    });
                    //updates.cocussionRooms    
                }

                c.update({_id:uuidHelperService.makeObjectId(sessionObject.caseId)},
                {
                    $set:updates
                },
                {upsert:false},
                (er3,updateResult)=>{
                    if(updateResult.result.nModified == 1)
                    {
                        next({ok:true,message:updateResult})
                    }else{
                        next({ok:false,message:'Could\'nt write/ or not authorized to update this case'})
                    }
                });

            }else{
                next({ok:false,message:'Case : ambiguity or not present'})
            }
        });
     })
     let discussionRoom = {
         name: 'discussion_'+uuidHelperService.makePublicId(),
         members : [],
         active:true,
         sessionId:sessionObject._id.toString()
     };
     sessionObject.individuals.forEach((i)=>{
        discussionRoom.members.push(i.email);
     });
     sessionObject.mediators.forEach((i)=>{

     });
  }
}
module.exports ={
  authenticate:(req,respond,next)=>{
    AuthJwtService.decode(req.token,(result)=>{
        if(result.ok){
            req.authDecoded = result.decoded ;
            next();
            /*
                MediationSessionService.joinSession(roomObject.name,email,(joinResult)=>{
                    if(joinResult.ok){
                        removeFeed();
                        safeCb(cb)(null, describeRoom(roomObject.name));
                        client.join(roomObject.name);
                        client.room = roomObject.name;
                        safeCb(cb)(joinResult);    
                    }else{
                        next(joinResult);                                                        
                    }
                });
            */
        }else{
            respond({ok:false,message:'Cant verify token'});
        }
    });
  }, 
    
  joinSession :(sessionId,email,type,respond,next)=>{
    // todo: check if this email is allowed to join this session or not
    privates.joinApproval(sessionId,email,type,(resObject)=>{
        if(resObject.ok){
            // do stuff and append things to resObject
            next(resObject);
        }else{
            next(resObject);
        }
    });
  },

  leaveSession :(sessionId,email,next)=>{

  },

  saveMessage : (payload)=>{
    Textmessages.native((e,c)=>{
        c.insert(payload);
    });
  },

  getAllMessages : (roomId,next)=>{
    Textmessages.native((e,c)=>{
        if(e!=null){return next({ok:false})}
        c.find({roomId:roomId}).toArray((e2,docs)=>{
            if(e2==null){
                return next({ok:true,docs:docs})
            }else{return next({ok:false})}
        });
    });
  }


}