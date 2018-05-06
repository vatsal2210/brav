/** 
    AgreementHelperService
**/

module.exports={
    createAgreement:(agreementDetailsObject,next)=>{
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error'});
            }
            c.count({'creator.email':agreementDetailsObject.creator.email,'title':agreementDetailsObject.title},
            (er2,count)=>{
                if(er2!=null){
                    next({ok:false,message:'db error at er3 level in create agreement'})
                }
                agreementDetailsObject._id = uuidHelperService.newObjectId();
                agreementDetailsObject.isFinal = false;
                agreementDetailsObject.payment = {status:Agreements.flags.PAYMENT_NOT_INITIATED};
                agreementDetailsObject.createdAt = TimeHelperService.getNow();
                if(count ==0){
                    c.insert(agreementDetailsObject,                                        
                    (er3,insertResult)=>{
                        if(er3!=null){
                            next({ok:false,message:'db error at er3 level in create agreement'})
                        }
                        if(insertResult.result.n == 1)
                        {
                            next({ok:true,agreementDetailsObject:agreementDetailsObject,message:'Here\'s the agreement'});                    
                        }else{
                            next({ok:false,message:'db insert failed'});                            
                        }
                    });
                }else{
                    next({ok:false,message:'such title already exists'});
                }
            })
        });
    },
    // save agreement is also done by this
    updateAgreement:(id,creator,updates,next)=>{
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error'});
            }
            c.update(
                {
                    _id:uuidHelperService.makeObjectId(id),
                   'creator':creator,
                    isFinal:false
                }, 
                { $set:updates},
                { upsert:false },
                (er2,updateResult)=>{
                    if(er2!=null){
                        return next({ok:false,message:'db error at er2 level in update agreement'})
                    }
                    if(updateResult.result.nModified == 1)
                    {
                        next({ok:true,message:'updated the agreement'});
                    }else{
                       // console.log(updateResult)                   
                        next({ok:false,message:'Couldnt update the agreement, it might be finalized, create a new one'});
                    }
                }
            );
        });
    },

    discard:(id,creator,next)=>{
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error'});
            }
            c.remove(
                {
                    _id:uuidHelperService.makeObjectId(id),
                    creator:creator,
                    isFinal:false
                }, 
                (er2,removeResult)=>{
                    //console.log('Remove Result : ',removeResult);
                    if(er2!=null){
                        return next({ok:false,message:'db error at er2 level in update agreement'})
                    }
                    if(removeResult.result.n == 1)
                    {
                        next({ok:true,message:'Discarded the agreement'});
                    }else{
                        next({ok:false,message:'Could not remove the agreement'});
                    }
                }
            );
        });
    },
 
    getAgreementContent:(id,email,next)=>{ // get saved content of an agreement
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error at level er1'});
            }
            c.find(
                {
                    _id:uuidHelperService.makeObjectId(id),
                    involvedParties:email,
                    isFinal:false
                },
                {
                    _id:1,
                    content:1,
                    checklist:1
                }).
                toArray((er2,docs)=>{
                    if(er2!=null){
                        return next({ok:false,message:'db error at er2 level in update agreement'})
                    }
                    if(docs.length ==1){
                        return next({ok:true,stuff:docs[0],message:'agreement found'});
                    }else{
                        return next({ok:false,message:'agreement not found or unauthprized accedd req'});
                    }
                }
            );
        });
    },

    finalize:(id,creator,next)=>{
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error at level er1'});
            }
            c.find(
                {
                    _id:uuidHelperService.makeObjectId(id),
                    creator:creator,
                    isFinal:false         
                },
                {
                    _id:1,
                    involvedParties:1
                }).
                toArray((er2,docs)=>{
                    if(er2!=null){
                        return next({ok:false,message:'db error at er2 level in update agreement'})
                    }
                    if(docs.length ==1){
                        let signingParties = docs[0].involvedParties.map((email)=>{
                            return {email:email,accepted:false,signed:false};
                        });
                        // console.log('generated signing parties ',signingParties);
                        let updates= {
                            isFinal : true,
                            signingParties : signingParties
                        };
                        c.update({_id:uuidHelperService.makeObjectId(id)}, 
                            { $set:updates},
                            { upsert:false }, 
                        (er3,updateResult)=>{
                            if(!er3)
                            {
                                return next({ok:true,message:'finalized the agreement'});
                            }
                            else{
                                return next({ok:false,message:'error at level 3 '});
                            }
                        });
                    }else{
                        return next({ok:false,message:'agreement not found or unauthprized access req'});
                    }
                }
            );
        });
    },

    sign:(email,accepted,id,next)=>{ // once signed
        // dont allow changes , if changes allowed revike sign request
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error'});
            }
            c.update(
                {
                    _id:uuidHelperService.makeObjectId(id),
                    'signingParties':{$elemMatch:{email:email,signed:false}},
                    isFinal:true
                }, 
                { 
                    $set:
                    {
                         'signingParties.$.accepted':accepted,
                         'signingParties.$.signed':true,
                    }
                },
                { upsert:false },
                (er2,updateResult)=>{
                    if(er2!=null){
                        return next({ok:false,message:'db error at er2 level in update agreement'})
                    }
                    if(updateResult.result.nModified == 1)
                    {
                        next({ok:true,message:'Signed the agreement with Acceptance : '+accepted});
                    }else{
                        next({ok:false,message:'Couldnt sign the document'});
                    }
                }
            );
        });
    },

    getAgreements:(one,flags,email,next)=>{
        let query ={};
        let single = one.yes ;
        let projection ={
            _id:1,
            title:1,
            description:1,
            'creator.email':1,
            isFinal:1,
            createdAt:1
        };
        if(single){
            console.log('in q',query)
            query['_id'] = uuidHelperService.makeObjectId(one.id),
            projection['content']= 1;
            projection['signingParties.email']= 1;
            projection['signingParties.signed']= 1;
            projection['signingParties.accepted']= 1;
        };
        // final care
        if(flags.isFinal==1){
            query['isFinal'] = true;
        }
        if(flags.isFinal==0){
            query['isFinal'] = false;
            projection['checklist']= 1;
            projection['involvedParties']= 1;
        }
        // creator care
        if(flags.isCreator==1){
            query['creator.email'] = email;
        }
        if(flags.isCreator==0){
            query['involvedParties'] = email;
        }
        // signed care
        if(flags.isSigned == 1){
            query['signingParties'] = {$elemMatch:{email:email,signed:true}};
        }
        if(flags.isSigned == 0){
            query['signingParties'] = {$elemMatch:{email:email,signed:false}};
        }
        console.log('q :',query);
        Agreements.native((er1,c)=>{
            if(er1 != null){
                return next({ok:false,message:'db error at level er1'});
            }
            c.find(query,projection).
                toArray((er2,docs)=>{
                    if(er2!=null){
                        return next({ok:false,message:'db error at er2 level in update agreement'})
                    }
                    console.log('All docs :',docs.length);
                    if(single){
                        if(docs.length ==1){
                            let stuff = docs[0];
                            //stuff.isFinal ~ it is there already in stuff
                            stuff.isCreator = (stuff.creator.email==email);
                            if(!stuff.isFinal){
                                if(stuff.isCreator){
                                    stuff.accessType =1; // creator edit nonfinal
                                }else{
                                    stuff.accessType =2; // non creator view nonfinal
                                }
                            }
                            else{
                                stuff.signingParties.forEach((e)=>{
                                    if(e.email==email){
                                        stuff.mySign = e ;
                                        if(!e.signed){
                                            stuff.accessType =3; // view final tosign
                                        }else{
                                            stuff.accessType =4; // view final signed
                                        }
                                    }
                                });
                            }
                            return next({ok:true,
                              agreement:stuff,
                              message:'details are here use to view/edit'
                            });
                        }else{
                            return next({ok:false,message:'agreement not found or unauthorized accedd req'});
                        }                        
                    }else{
                        return next({ok:true,list:docs,message:'have the list'});
                    }
                }
            );
        });
    },
       
    generatePdf:(content,next)=>{ // get PDF version

    },
}
