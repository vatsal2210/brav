/**
  ChatSessions.js
 */

module.exports = {

  attributes: {

    schedule : 'json', // {date , time , tz , GST}
    dateslot : 'datetime',
    timeslot : 'datetime',
    org : 'json',
    sesh: 'json', //{title}
    users:'array', // {email , willJoin, hasDenied, hasJoined , hasLeft } {mail , false , false , false , false}
    mediators:'array',   // {email , willJoin , hasDenied, hasJoined , hasLeft } {mail, true , false, false , false , }
    status : 'integer', // 1 planned , 2 initiated (atleast 1 joined) , 3 all users joined , 4 completed
    mediatorSignal :'integer' // 0 no mediator planned, 1 has a mediator planned , 2 all mediators joined , 3 all mediators left , 4 mediator signed as session completed

  }

};
