/**
 * WebinarSessions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

 attributes: {
    title:'string',
    information:'string',
    schedule : 'json', // {date , time , tz , GST}
    creator : 'json', // {userId, type}
    hours_paid:'integer',
    paymentRef :'json' , // {type:|USD|OBC|,amount,timestamp}
    attendants:'array', // {userId,name,type,willJoin,hasJoined,hasLeft,}
    status : 'integer', // 
  }
};