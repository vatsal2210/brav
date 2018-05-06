/**
 * MediationSession.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
 flags:{
      /** Session */
      REGISTERED :11,
      PAID: 12,
      SCHEDULED: 13,
      STARTED: 21,
      ENDED:22,
      /** Payment */
      PAYMENT_NOT_INITIATED :21,
      
      PAYMENT_FAIL : 22,

      PAYMENT_INITIATED :31,

      PAYMENT_SUCCESSFUL :33,
      PAYMENT_BYPASSED :34,
      
 },
 attributes: {
    schedule : 'json', // {epoch,tz}
    creator : 'json', // {email, type}
    createdAt:'integer', //
    payment :'json', // {type:|USD|OBC|,hours_paid , ref ,status , actor }
    sessionObject : 'json',  // { caseTitle , caseId , title, description , hours}
    individuals:'array',   // {email , responded , accepted , hasJoined , hasLeft } 
    mediators:'array',   //  {email or id(mongoIdStr) , rate, responded, accepted , hasJoined , hasLeft }
    sessionStatus : 'integer', //  // 11 = started
    rooms:'array', // [{name, parties: [{email}], }]
    dynamics :'json', // { startingTimeStamp , endingTimeStamp }
    requestDynamics:'json', //
 }
};

/*** 
  projection for getAllSessions
  {
      _id:1,
      schedule:1,
      'payment.status':1,
      'payment.hours_paid':1,
      sessionObject:1,
      individuals:1,
      mediators:1,
      sessionStatus:1
   }
 ***/
