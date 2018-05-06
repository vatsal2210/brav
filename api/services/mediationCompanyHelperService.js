/**
 * Created by Omkar Dusane on 10-Feb-17.
 * 
 *  MediationSessionService
 * 
 */
module.exports = {
    createMediationCompany:(company,next)=>{
        name = company.name.trim();
        if(!name){
             next({ok:false,message:'name null'});
             return;
        }
        else if(name.length < 1){
             next({ok:false,message:'name empty'});
             return;
        }
        const nameRegex = new RegExp(name, "i");
        MediationCompany.native((er1, c)=>{
            if(er1!=null) {
              next({ok:false,message:'db error'})
              return;
            }
            let count = c.count({name:{'$in':[name,nameRegex]}},(er2,count)=>{
                if(count==0){
                    c.insert({
                        name:name,
                        contact:company.contact,
                        members:company.members,
                        creator: { email: company.creator },
                        country: company.country,
                        currency: company.currency,
                        createdAt:TimeHelperService.getNow(),
                      },
                      (er3,insertResult)=>{
                        if(insertResult.result.n == 1){
                           next({ok:true,message:'Created Org'})
                        }
                        else{
                            next({ok:false,message:'Could\'nt write to db'})
                        }
                    });
               }
               else{
                next({ok:false,message:'This Mediation Organization is already registered, please try different name'})
               }
            });
        });
    }, 

    //emailid
    getAllOrgsByMediatorId:(eid, next)=>{
        MediationCompany.native(function (er1, collection) {
            collection.find({
                                "creator.email" : eid
                            },
                            {name:1, "contact.email": 1, "creator.email" :1}).toArray(function (er2, docs) {
                            if(er2==null){
                                next(true,docs) // ok=true , 
                            }
                            else{
                                // db error
                                next(false,null) // ok = false
                            }
            })
        });
    },

    getMyMediationCompany:(eid, next)=>{
        MediationCompany.native(function (er1, collection) {
            collection.find({
                                // approved: true
                                members : 
                                    { $elemMatch : 
                                        { 
                                            email : eid, 
                                            isMember: true,
                                            accepted: true
                                        } 
                                    } 
                            },
                            {_id:1, name:1 , creator:1, contact: 1} ).toArray(function (er2, docs) {
                            if(er2==null){
                                next(true,docs) 
                            }
                            else{
                                // db error
                                next(false,null) 
                            }
            })
        });
    },

    getPendingMediationCompany:(eid, next)=>{
        MediationCompany.native(function (er1, collection) {
            collection.find({
                               //approved: true,
                                members : 
                                    { $elemMatch : 
                                        { 
                                            email : eid, 
                                            isMember: false,
                                            accepted: false,
                                            responded: false
                                        } 
                                    } 
                            },
                            {_id:1, name:1 , creator:1, contact: 1}).toArray(function (er2, docs) {
                            if(er2==null){
                                next(true,docs) 
                            }
                            else{
                                // db error
                                next(false,null) 
                            }
            })
        });
    },
    getOrgProfile :(name,next)=>{
        MediationCompany.native(function (er1, collection) {
            collection.findOne({name:name},{ _id:0 },function (er2, doc) {
            console.log("Findone",doc);
                if(er2==null && doc){
                    next(true,doc);
                }
                else{
                    next(false,null);
                }
            })
        });
    },

    updateOrgProfile:(name,next)=>{
    
    },
    inviteMember:(invitorId,toInviteEmail,orgId)=>{

    },
    addMember:(toAddEmail,orgId)=>{// accepted after invitation

    },
    removeMember:(toRemoveEmail,orgId)=>{

    },

}