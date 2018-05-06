/**
 * 
 * individualService
 * Created by Omkar Dusane on 26-Oct-16.
 */
module.exports ={

  getAllIndProfiles: function (next) {
    Users.native(function (er1, c) {
      c.find({type:4},{email:1,name:1,verified:1}).toArray(function(er2,docs){
        if(er2==null){
          next(true,docs);
        }
        else{
          next(false,null);
        }
      });
    });
  },

  getIndividualsMiniProfilesForMediationSession : (individualsArray,next)=>{
    let emails = [];
    individualsArray.forEach((m)=>{
       if(m.email){
          emails.push(m.email);
       }
    });
    Users.native((er1,c)=>{
      if(er1){return next({ok:false})}
      c.find({email:{$in:emails}},{
        email:1,
        name:1,
      }).toArray((er2,docs)=>{
        if(er2){return next({ok:false})}
        return next({ok:true,docs:docs});
      });
    });
  }

}
