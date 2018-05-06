/**
 * MediationCompany.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  flags:{
    LEAVING_TRIGGERS:{
      REMOVED:10,
      LEFT:11,
    } 
  },
  attributes: {
    name: 'string',
    creator:'json', // {email or userId}
    members: 'array', /** [{email:mail, joined:}] */
    contact:'json' , /**  {phone, email, address} */
    country: 'string',
    currency: 'string',
    approved: 'boolean',
    createdAt:'long'
  }
};

/** HINTS */
//   MediationCompany collection sample Object : 
/*
let sample = {
    name: 'string',
    creator:'json', // {email or userId}
    members:  [ // assume a respondedAt field to recodt that epoch timestamp
      {email:'mail', requestedAt: 'epoch' , responded: true , accepted: true ,isMember:true},
      {email:'mail2', requestedAt: 'epoch' , responded: false },
      {email:'mail3', requestedAt: 'epoch' , responded: true , accepted: false ,isMember: false  } ,
      {email:'mail4', requestedAt: 'epoch' , responded: true , accepted: true , isMember:true } ,
      {email:'mail5', requestedAt: 'epoch' , responded: true , accepted: true , 
        isMember:false , removedAt: 'epoch', leavingTrigger:MediationCompany.flags.LEAVING_TRIGGERS.LEFT} ,
      {email:'mail6', requestedAt: 'epoch' , responded: true , accepted: true ,   
        isMember:false , removedAt: 'epoch', leavingTrigger:MediationCompany.flags.LEAVING_TRIGGERS.REMOVED} ,
    
      ],
    contact:'json' , 
    country: 'string',
    currency: 'string',
    approved: 'boolean',
    createdAt:'long'
}

let getter = (er,collection)=>{

    // all a
    let q = {'members':{$elemMatch:{email:'mail6'}}} ;
    //  // above query is useful to find out a person's response adding {email:"mail6",responded:true}
    //OR query can be :: just to find out all companies of  mail6 
    // q = {members : 'mail6'};
    collection.find(q,{projections:'as per you ifgure out'},
    )
}
*/
