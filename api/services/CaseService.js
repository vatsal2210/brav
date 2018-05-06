/**
 * Created by Omkar Dusane on 8-Feb-17.
 *
 *  CaseService
 *
 */
module.exports = {

  createCase: (title, info ,creator, next)=>{
      /**
       * params: title, info , involved people
       */
      Cases.native((er1, c)=>{
            if(er1!=null) {
              next({ok:false,message:'db error'})
              return;
            }
            c.count({title:title,'creator.email':creator.email},(er2,count)=>{
               if(count==0){
                c.insert({
                    title:title,info:info,
                    creator:creator,
                    createdAt:TimeHelperService.getNow(),
                    status:[{message:'created',ts:TimeHelperService.getNow()}]
                },(er3,insertResult)=>{
                    if(insertResult.result.n == 1)
                    {
                        next({ok:true,message:'Case ' + title + ' has been created'})
                    }else{
                        next({ok:false,message:'Could\'nt write to db'})
                    }
                });
               }else{
                next({ok:false,message:'Case ' + title + ' is already present'})
               }
            });
       });
  },
  updateCase: (title, info, email,next)=>{
    console.log("req",title, info, email);
      Cases.native(function (er1, c) {
          console.log(er1);
            if(er1!=null) {
              next({ok:false,message:'db error'})
              return;
            }
              c.update(
                {title:title,'creator.email':email},
                {'$set': {info:info}},
                {upsert:false}
                ,(er2,updateResult)=>{
                if(updateResult.result.nModified == 1)
                {
                    next({ok:true,message:updateResult})
                }else{
                    next({ok:false,message:'Could\'nt write/ or not authorized to update this case'})
                }
              });
       });
  },
  updateCaseStatus :(statusMessage,title,email)=>{
    Cases.native(function (er1, c) {
            if(er1!=null) {
              next({ok:false,message:'db error'})
              return;
            }
            c.update(
                {title:title,'creator.email':email},
                {'$push': {'status':{message:statusMessage,ts:TimeHelperService.getNow()}}},
                {upsert:false}
            ,(er2,updateResult)=>{
                if(updateResult.result.nModified == 1)
                {
                    next({ok:true,message:updateResult})
                }else{
                    next({ok:false,message:'Could\'nt write to db'})
                }
            });
       });
  },
  getAllCasesByCreatorEmail:(email,next)=>{
     Cases.native((er1, c)=> {
       if(er1!=null) {
         next({ok:false,message:'db native error'})
         return;
       }
       c.find({'creator.email':email},{title:1,info:1,status:1}).toArray((er2,docs)=>{
         if(er2!=null){
            next({ok:false,message:'db read error'})
            return;
         }else{
            next({ok:true,message:'success',cases:docs});
         }
       });
     });
  },
  getAllCasesByInvolvedPeople:(emailsArray,next)=>{
     Cases.native((er1, c)=> {
       if(er1!=null) {
         next({ok:false,message:'db native error'})
         return;
       }
       c.find({'involvedPeople.email':{$in:emailsArray}},{title:1,info:1,status:1}).toArray((er2,docs)=>{
         if(er2!=null){
            next({ok:false,message:'db read error'})
            return;
         }else{
            next({ok:true,message:'success',cases:docs});
         }
       });
     });
  },
  addInvolvedPeople:(title,emails,creatoremail,next)=>{
      Cases.native(function (er1, c) {
            if(er1!=null) {
              next({ok:false,message:'db error'})
              return;
            }
            c.update(
                {title:title,'creator.email':creatoremail},
                {'$push': {'involvedPeople':emails}},
                {upsert:true}
             ,(er2,updateResult)=>{
                if(updateResult.result.nModified == 1)
                {
                    next({ok:true,message:updateResult})
                }else{
                    next({ok:false,message:'Could\'nt write to db'})
                }
            });
       });
  },
  
}
